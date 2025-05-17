import { Injectable } from '@nestjs/common';
import { SubscriptionsRepository } from './subscriptions.repository';
import { AdminsService } from '../admins/admins.service';
import { changePlanDto } from './dtos/change-plan.dto';
import { createSubscriptionDto } from './dtos/create-subscription.dto';

@Injectable()
export class SubscriptionsService {
   
  constructor(
    private readonly subscriptionsRepository: SubscriptionsRepository,
    private readonly adminsService: AdminsService,
  ) {}

  addTrialSubscription() {
    return this.subscriptionsRepository.addTrialSubscription();
  }

  async getSubscriptionByAdminId(admin_id: string) {
    const foundAdmin = await this.adminsService.getAdminById(admin_id);

    return this.subscriptionsRepository.getSubscriptionByAdminId(admin_id)

  }
  createSubscription(data: createSubscriptionDto) {
    return this.subscriptionsRepository.createSubscription(data)
  }

  canceledSubscription(subscription_id: string) {
    return this.subscriptionsRepository.canceledSubscription(subscription_id)
  }

  reactivateSubscription(subscription_id: string) {
    return this.subscriptionsRepository.reactivateSubscription(subscription_id)
  }

  changePlan(data: changePlanDto) {
    return this.subscriptionsRepository.changePlan(data)
  }

  handleWebhook(rawBody: any, signature: string) {
    return this.subscriptionsRepository.handleWebhook(rawBody, signature);
  }

  getSubscriptionByUserId(user_id: string) {
    return this.subscriptionsRepository.getSubscriptionByUserId(user_id)
  }
}