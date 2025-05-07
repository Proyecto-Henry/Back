import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from 'src/entities/Subscription.entity';
import { Plan } from 'src/enums/plan.enum';
import { Status_Sub } from 'src/enums/status_sub.enum';
import { AdminsService } from 'src/modules/admins/admins.service';
import { changePlanDto } from 'src/modules/subscriptions/dtos/change-plan.dto';
import { createSubscriptionDto } from 'src/modules/subscriptions/dtos/create-subscription.dto';
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

  
      async createSubscription(data: createSubscriptionDto) {
        const queryRunner = this.subscriptionsRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        
        let customer: Stripe.Customer | undefined;
        let plan: Stripe.Plan | undefined;
        let product: Stripe.Product | undefined;
        let stripeSubscription: Stripe.Subscription | undefined;
      
        try {
          // 1. Crear cliente
          console.log('🔄 Creando cliente en Stripe...');
          customer = await this.stripe.customers.create({
            email: data.customer.email,
            name: data.customer.name,
          });
          console.log('✅ Cliente creado en Stripe:', customer.id);
      
          // 2. Crear producto y plan
          console.log('🔄 Creando producto en Stripe...');
          product = await this.stripe.products.create({
            name: data.plan.name,
          });
          console.log('✅ Producto creado en Stripe:', product.id);
      
          console.log('🔄 Creando plan en Stripe...');
          plan = await this.stripe.plans.create({
            amount: data.plan.amount * 100, // Stripe usa centavos
            currency: 'usd',
            interval: data.plan.interval,
            product: product.id,
          });
          console.log('✅ Plan creado en Stripe:', plan.id);
      
          // 3. Adjuntar método de pago al cliente
          console.log('🔄 Adjuntando método de pago al cliente...');
          await this.stripe.paymentMethods.attach(data.subscription.paymentMethod, {
            customer: customer.id,
          });
          console.log('✅ Método de pago adjuntado');
      
          // 4. Establecer método de pago como predeterminado
          console.log('🔄 Estableciendo método de pago predeterminado...');
          await this.stripe.customers.update(customer.id, {
            invoice_settings: {
              default_payment_method: data.subscription.paymentMethod,
            },
          });
          console.log('✅ Método de pago predeterminado asignado');
      
          // 5. Crear suscripción
          console.log('🔄 Creando suscripción en Stripe...');
          stripeSubscription = await this.stripe.subscriptions.create({
            customer: customer.id,
            items: [{ plan: plan.id }],
            expand: ['latest_invoice']
          });
          console.log('✅ Suscripción creada en Stripe:', stripeSubscription.id);
      
          // 6. Guardar suscripción en la base de datos
          console.log('🔄 Buscando admin con email:', data.customer.email);
          const admin = await this.adminsService.getAdminByEmail(data.customer.email);
          if (!admin) throw new Error('Admin no encontrado');
          console.log('✅ Admin encontrado:', admin.id);
          const subscription = await this.subscriptionsRepository.findOne({
            where: { admin: { id: admin.id } },
            relations: ['admin']
          });

          if(subscription) {
            subscription.plan = data.subscription.plan
            subscription.start_date = new Date()
            subscription.end_date = new Date(new Date().setMonth(new Date().getMonth() + 1))
            subscription.status = Status_Sub.ACTIVE
            subscription.external_subscription_id = stripeSubscription.id
            subscription.external_subscription_item_id = stripeSubscription.items.data[0].id;
            subscription.stripe_customer_id = customer.id;
            subscription.stripe_plan_id = plan.id;
          }
          
          await queryRunner.manager.save(subscription);
          await queryRunner.commitTransaction();
      
          console.log('✅ Suscripción guardada en la base de datos:', subscription?.id);
      
          return { success: true, subscriptionId: stripeSubscription.id };
        } catch (error) {
          await queryRunner.rollbackTransaction();
      
          // Limpieza si algo falló
          if (stripeSubscription) {
            await this.stripe.subscriptions.cancel(stripeSubscription.id).catch(() => null);
            console.log('🔄 Suscripción cancelada en Stripe:', stripeSubscription.id);
          }
          if (plan) {
            await this.stripe.plans.del(plan.id).catch(() => null);
            console.log('🔄 Plan eliminado de Stripe:', plan.id);
          }
          if (product) {
            await this.stripe.products.del(product.id).catch(() => null);
            console.log('🔄 Producto eliminado de Stripe:', product.id);
          }
          if (customer) {
            await this.stripe.customers.del(customer.id).catch(() => null);
            console.log('🔄 Cliente eliminado de Stripe:', customer.id);
          }
      
          console.error('❌ Error real en StripeService.createSubscription:', error);
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
        console.log('🔄 Iniciando proceso de cancelación para:', subscription_id);
        console.log('🔄 Marcando suscripción como cancelada al final del período en Stripe...');
        await this.stripe.subscriptions.update(subscription_id, {
          cancel_at_period_end: true,
        })
        console.log('✅ Suscripción marcada para cancelar al final del período');
        console.log('🔄 Buscando suscripción en base de datos...');
        const subscription = await queryRunner.manager.findOneBy(Subscription, {
          external_subscription_id: subscription_id,
        });

        if(subscription) {
          console.log('✅ Suscripción encontrada:', subscription.id);
          subscription.status = Status_Sub.CANCELLED
          console.log('🔄 Guardando estado CANCELLED en la base de datos...');
          await queryRunner.manager.save(subscription);
          console.log('✅ Estado actualizado en la base de datos');
        }

        await queryRunner.commitTransaction();
        console.log('✅ Transacción completada correctamente');
      } catch (error) {
        console.error('❌ Error al cancelar suscripción:', error);
        // revertir el cambio en Stripe (eliminando la cancelación programada)
        console.log('🔄 Revirtiendo cancelación programada en Stripe...');
        await this.stripe.subscriptions.update(subscription_id, {
          cancel_at_period_end: false,
        });
        console.log('✅ Cancelación revertida');
        await queryRunner.rollbackTransaction();
        console.log('🔄 Transacción revertida');
        throw new Error('No se pudo cancelar la suscripción correctamente');
      } finally {
        await queryRunner.release();
        console.log('🔄 QueryRunner liberado');
      }
    }

    async reactivateSubscription(subscription_id: string) {
      const queryRunner = this.subscriptionsRepository.manager.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        console.log(`🔄 Reactivando suscripción con ID: ${subscription_id}...`);
        // 1. Quitar cancelación programada en Stripe
        const updatedSubscription = await this.stripe.subscriptions.update(subscription_id, {
        cancel_at_period_end: false,
      });
      console.log(`✅ Cancelación eliminada en Stripe: ${updatedSubscription.id}`);
      // 2. Buscar suscripción en la base de datos
      const subscription = await queryRunner.manager.findOneBy(Subscription, {
      external_subscription_id: subscription_id,
      });

      if(subscription) {
        // 3. Actualizar estado en la base de datos
      subscription.status = Status_Sub.ACTIVE;
      await queryRunner.manager.save(subscription);
      console.log(`💾 Estado actualizado a ACTIVE en la base de datos para la suscripción: ${subscription_id}`);
      await queryRunner.commitTransaction();
      console.log('✅ Suscripción reactivada con éxito.');
      }
      } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error('❌ Error al reactivar la suscripción:', error.message);
        // Revertir el cambio en Stripe si falló la base de datos
        try {
          await this.stripe.subscriptions.update(subscription_id, {
            cancel_at_period_end: true,
          });
          console.log(`↩️ Se restauró cancelación programada en Stripe: ${subscription_id}`);
        } catch (stripeError) {
          console.error('⚠️ No se pudo restaurar cancelación en Stripe:', stripeError.message);
        }
        throw new Error('No se pudo reactivar la suscripción correctamente');
      } finally {
        await queryRunner.release();
      }

    }

    async changePlan(data: changePlanDto) {
      const queryRunner = this.subscriptionsRepository.manager.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
    
      let itemId: string | undefined;
      let oldPlanId: string | undefined;
      let product: Stripe.Product | undefined;
      let newPlan: Stripe.Plan | undefined;
    
      try {
        const subscriptionStripe = await this.stripe.subscriptions.retrieve(data.subscription_id);
        itemId = subscriptionStripe.items.data[0].id;
        oldPlanId = subscriptionStripe.items.data[0].plan.id;
    
        // 1. Crear nuevo producto y plan
        console.log('🔨 Creando nuevo producto en Stripe con nombre:', data.planId);
        product = await this.stripe.products.create({ name: data.planId });
        console.log('✅ Producto creado en Stripe:', product.id);
        console.log('🔄 Creando nuevo plan en Stripe con monto:', this.getAmountForPlan(data.planId));
        newPlan = await this.stripe.plans.create({
          amount: this.getAmountForPlan(data.planId) * 100,
          currency: 'usd',
          interval: 'month',
          product: product.id,
        });
        console.log('✅ Nuevo plan creado en Stripe:', newPlan.id);
        // 2. Actualizar suscripción con nuevo plan
        console.log(`🔁 Actualizando suscripción ${data.subscription_id} con nuevo plan...`);
        await this.stripe.subscriptions.update(data.subscription_id, {
          items: [{ id: itemId, plan: newPlan.id }],
          proration_behavior: 'create_prorations',
        });
        console.log('✅ Suscripción actualizada correctamente en Stripe.');
        // 3. Actualizar en la base de datos
        const subscription = await queryRunner.manager.findOneBy(Subscription, {
          external_subscription_id: data.subscription_id,
        });
    
        if (subscription) {
          console.log('🔁 Actualizando suscripción en base de datos con nuevo plan:', data.planId);
          subscription.plan = data.planId;
          subscription.stripe_plan_id = newPlan.id;
          await queryRunner.manager.save(subscription);
          console.log('✅ Suscripción actualizada en base de datos:', subscription.id);
        }
    
        await queryRunner.commitTransaction();
        console.log('✅ Transacción completada exitosamente.');
      } catch (error) {
        console.error('❌ Error en el proceso de cambio de plan:', error)
        await queryRunner.rollbackTransaction();
        console.log('↩️ Transacción revertida.');
        // Revertir en Stripe
        if (itemId && oldPlanId) {
          console.log('🔄 Revirtiendo cambio de plan en Stripe...');
          await this.stripe.subscriptions.update(data.subscription_id, {
            items: [{ id: itemId, plan: oldPlanId }],
            proration_behavior: 'none',
          });
          console.log('✅ Plan revertido al original en Stripe.');
        }
    
        throw new Error('No se pudo cambiar el plan, se realizó rollback.');
      } finally {
        await queryRunner.release();
        console.log('🔚 QueryRunner liberado.');
      }
    }
    
  
    private getAmountForPlan(planLabel: string): number {
      switch (planLabel) {
        case '1 store':
          return 10;
        case '2 stores':
          return 18;
        case '4 stores':
          return 30;
        default:
          throw new Error('Plan inválido');
      }
    }
}