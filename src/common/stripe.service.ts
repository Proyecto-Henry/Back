import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from 'src/entities/Subscription.entity';
import { Status_Sub } from 'src/enums/status_sub.enum';
import { AdminsService } from 'src/modules/admins/admins.service';
import { changePlanDto } from 'src/modules/subscriptions/dtos/change-plan.dto';
import { FullSubscriptionDto } from 'src/modules/subscriptions/dtos/full-subscription.dto';
import { reactivateSubscriptionDto } from 'src/modules/subscriptions/dtos/reactivate-subscription.dto';
import Stripe from 'stripe';
import { Repository } from 'typeorm';

  @Injectable()
  export class StripeService {
    
      private stripe: Stripe;

      constructor(
      @InjectRepository(Subscription) private subscriptionsRepository: Repository<Subscription>,
      private readonly adminsService: AdminsService
      ) {
          const stripeKey = process.env.STRIPE_SECRET_KEY;

          if (!stripeKey) {
          throw new Error("STRIPE_SECRET_KEY no está definido en las variables de entorno");
          }

          this.stripe = new Stripe(stripeKey, {
          apiVersion: '2025-03-31.basil',
          });
      }

  
    async createSubscription(data: FullSubscriptionDto) {

        const queryRunner = this.subscriptionsRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        let customer: Stripe.Customer | undefined;
        let plan: Stripe.Plan | undefined;
        let stripeSubscription: Stripe.Response<Stripe.Subscription> | undefined;

        try {
          //Crear cliente
          const customer = await this.stripe.customers.create({ email: data.customer.email, name: data.customer.name });

          const plan = await this.stripe.plans.create({
            amount: data.plan.amount * 100, // Convertir a centavos
            currency: 'usd',
            interval: data.plan.interval, // 'month'
            product: { name: data.plan.name },
          });

          // Paso 2: Configurar como predeterminado
          await this.stripe.customers.update(data.subscription.customerId, {
            invoice_settings: {
              default_payment_method: data.subscription.paymentMethod,
            },
          });

          // Paso 3: Crear la suscripción
          const stripeSubscription = await this.stripe.subscriptions.create({
          customer: data.subscription.customerId,
          items: [{ plan: data.subscription.planId }],
          // default_payment_method: paymentMethod, // opcional ahora
          });

          const admin = await this.adminsService.getAdminByEmail(data.customer.email)
          if (admin) {
          const subscription = this.subscriptionsRepository.create({
            plan: data.subscription.plan, // Ajustar según el plan
            start_date: new Date(),
            end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)), // Ejemplo: 1 mes
            status: Status_Sub.ACTIVE,
            external_subscription_id: stripeSubscription.id,
            admin: admin // Ajusta según el usuario autenticado
          });
            
          await queryRunner.manager.save(subscription);
          await queryRunner.commitTransaction();
          }
        } catch (error) {
          await queryRunner.rollbackTransaction();
          //Limpieza en Stripe si algo salió mal
          
            if (stripeSubscription) {
              await this.stripe.subscriptions.cancel(stripeSubscription.id);
            }
            if (plan) {
              await this.stripe.plans.del(plan.id);
            }
            if (customer) {
              await this.stripe.customers.del(customer.id);
            }
          

          throw new Error('Error al crear la suscripción');
        } finally {
          await queryRunner.release();
        }
    }

    async canceledSubscription(subscription_id: string) {
      const queryRunner = this.subscriptionsRepository.manager.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        await this.stripe.subscriptions.update(subscription_id, {
          cancel_at_period_end: true,
        })

        const subscription = await queryRunner.manager.findOneBy(Subscription, {
          external_subscription_id: subscription_id,
        });

        if(subscription) {
          subscription.status = Status_Sub.CANCELLED
          await queryRunner.manager.save(subscription);
        }

        await queryRunner.commitTransaction();
      } catch (error) {
        // revertir el cambio en Stripe (eliminando la cancelación programada)
        await this.stripe.subscriptions.update(subscription_id, {
          cancel_at_period_end: false,
        });
        await queryRunner.rollbackTransaction();
        throw new Error('No se pudo cancelar la suscripción correctamente');
      } finally {
        await queryRunner.release();
      }
    }

    async reactivateSubscription(data: reactivateSubscriptionDto) {
      // 1. Obtener método de pago existente
      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: data.customerId,
        type: 'card',
      });

      if (!paymentMethods.data.length) {
        throw new Error('No hay métodos de pago guardados.');
      }

      const defaultPaymentMethod = paymentMethods.data[0].id;

      // 2. Asignar como método predeterminado
      await this.stripe.customers.update(data.customerId, {
        invoice_settings: {
          default_payment_method: defaultPaymentMethod,
        },
      });

      // 3. Crear nueva suscripción
      const newSubscription = await this.stripe.subscriptions.create({
        customer: data.customerId,
        items: [{ price: data.planId }],
        default_payment_method: defaultPaymentMethod,
      });

      // 4. Guardar en la base de datos con transacción
      const queryRunner = this.subscriptionsRepository.manager.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction()

      try {
        const admin = await this.adminsService.getAdminByEmail(data.email);

      if (admin) {
        const subscription = this.subscriptionsRepository.create({
          plan: data.planId,
          start_date: new Date(),
          end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
          status: Status_Sub.ACTIVE,
          external_subscription_id: newSubscription.id,
          admin,
        });

        await queryRunner.manager.save(subscription);
        await queryRunner.commitTransaction();
      }
      } catch (error) {
        await queryRunner.rollbackTransaction();
        //Revertir en Stripe si falló la base de datos
        await this.stripe.subscriptions.update(newSubscription.id, {
          cancel_at: Math.floor(Date.now() / 1000), // ahora
        });
        throw new Error('Error al guardar la suscripción en la base de datos.');
      } finally {
        await queryRunner.release();
      }
    }

    async changePlan(data: changePlanDto) {
      const queryRunner = this.subscriptionsRepository.manager.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      let itemId: string | undefined;
      let oldPriceId: string | undefined;


      try {
        // 1. Obtener info previa para posible rollback
        const subscriptionStripe = await this.stripe.subscriptions.retrieve(data.subscription_id);
        itemId = subscriptionStripe.items.data[0].id;
        oldPriceId = subscriptionStripe.items.data[0].price.id;

        await this.stripe.subscriptions.update(data.subscription_id, {
          items: [{
            id: itemId,
            price: data.planId,
          }],
          proration_behavior: 'create_prorations', // se puede cambiar a 'none'
        })
  
        const subscription = await queryRunner.manager.findOneBy(Subscription, {
          external_subscription_id: data.subscription_id,
        })

        if(subscription) {
          subscription.plan = data.planId
          await queryRunner.manager.save(subscription);
        }

        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        // 4. Revertir en Stripe

        if (itemId && oldPriceId) {
          await this.stripe.subscriptions.update(data.subscription_id, {
            items: [{
              id: itemId,
              price: oldPriceId,
            }],
            proration_behavior: 'none', // opcional: sin cargo extra al revertir
          });
        }

        throw new Error('No se pudo cambiar el plan, se realizó rollback.');
      } finally {
        await queryRunner.release();
      }
    }
}