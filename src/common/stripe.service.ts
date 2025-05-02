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
        //Crear cliente
        const customer = await this.stripe.customers.create({ email: data.customer.email, name: data.customer.name });
        //return customer;
        //Crear plan
        const plan = await this.stripe.plans.create({
            amount: data.plan.amount * 100, // Convertir a centavos
            currency: 'usd',
            interval: data.plan.interval, // 'month'
            product: { name: data.plan.name },
          });
        //return plan;
        //Crear suscripción

        // Paso 1: Adjuntar método de pago al cliente
    await this.stripe.paymentMethods.attach(data.subscription.paymentMethod, {
        customer: data.subscription.customerId,
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
            
        await this.subscriptionsRepository.save(subscription);
        //return savedSubscription
    }
    }

    async canceledSubscription(subscription_id: string) {
      await this.stripe.subscriptions.update(subscription_id, {
        cancel_at_period_end: true,
      })

      const subscription = await this.subscriptionsRepository.findOneBy({external_subscription_id: subscription_id})
      if(subscription) {
        subscription.status = Status_Sub.CANCELLED
        await this.subscriptionsRepository.save(subscription)
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

      // 4. Guardar en la base de datos
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

        await this.subscriptionsRepository.save(subscription);
      }

      // return newSubscription;
    }

    async changePlan(data: changePlanDto) {
      await this.stripe.subscriptions.update(data.subscription_id, {
        items: [{
          id: await this.getSubscriptionItemId(data.subscription_id),
          price: data.planId,
        }],
        proration_behavior: 'create_prorations', // se puede cambiar a 'none'
      })

      const subscription = await this.subscriptionsRepository.findOneBy({external_subscription_id: data.subscription_id})
      if(subscription) {
        subscription.plan = data.planId
        await this.subscriptionsRepository.save(subscription)
      }
    }

    private async getSubscriptionItemId(subscription_id: string): Promise<string> {
      const subscription = await this.stripe.subscriptions.retrieve(subscription_id);
      return subscription.items.data[0].id;
    }
}