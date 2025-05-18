import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from 'src/entities/Subscription.entity';
import { Plan } from 'src/enums/plan.enum';
import { Status_Sub } from 'src/enums/status_sub.enum';
import { Repository } from 'typeorm';
import { StripeService } from 'src/common/stripe.service';
import { changePlanDto } from './dtos/change-plan.dto';
import { createSubscriptionDto } from './dtos/create-subscription.dto';
import { AdminsService } from '../admins/admins.service';

@Injectable()
export class SubscriptionsRepository {
  
  constructor(
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
    private readonly stripeService: StripeService,
    private readonly adminsService: AdminsService
  ) {}

  addTrialSubscription() {
    const startSubscription = new Date();
    const endSubscription = new Date();
    endSubscription.setMonth(endSubscription.getMonth() + 1);

    const newSubscription = this.subscriptionsRepository.create({
      plan: Plan.BASIC,
      start_date: startSubscription,
      end_date: endSubscription,
      status: Status_Sub.TRIAL,
    });

    return newSubscription;
  }

  async getSubscriptionByAdminId(adminId: string) {
    const subscription = await this.subscriptionsRepository.findOne({
      where: { admin: { id: adminId } },
      relations: ['admin'],
    });
    if (!subscription) {
       throw new NotFoundException('No se encontró la suscripción');
    }

    const {
      admin: {
        password,
        google_id,
        phone,
        img_profile,
        status,
        created_at,
        ...cleanAdmin
      },
      ...restOfSubscription
    } = subscription;

    const cleanedSubscription = {
      ...restOfSubscription,
      admin: cleanAdmin
    };
    return cleanedSubscription
  }

  createSubscription(data: createSubscriptionDto) {
    return this.stripeService.createSubscription(data)
  }

  canceledSubscription(subscription_id: string) {
    return this.stripeService.canceledSubscription(subscription_id);
  }


  reactivateSubscription(subscription_id: string) {
    return this.stripeService.reactivateSubscription(subscription_id)
  }

  changePlan(data: changePlanDto) {
    return this.stripeService.changePlan(data)
  }

  handleWebhook(rawBody: any, signature: string) {
    return this.stripeService.handleWebhook(rawBody, signature);
  }

  async getSubscriptionByUserId(user_id: string) {
    const result = await this.adminsService.getAdminByUserId(user_id)
    if(!result){
      throw new NotFoundException('No se encontró al administrador');
    }
    const subscription = await this.getSubscriptionByAdminId(result.id)
    if(!subscription) {
      throw new NotFoundException('No se encontró la suscripción');
    }
    const { admin, ...subscriptionWithoutAdmin } = subscription;
    return subscriptionWithoutAdmin
  }
}


 

