import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from 'src/entities/Subscription.entity';
import { Status_Sub } from 'src/enums/status_sub.enum';
import { AdminsService } from 'src/modules/admins/admins.service';
import { FullSubscriptionDto } from 'src/modules/subscriptions/dtos/full-subscription.dto';
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
}