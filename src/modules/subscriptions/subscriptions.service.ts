import { Injectable } from '@nestjs/common';
import { SubscriptionsRepository } from './subscriptions.repository';
import { AdminsService } from '../admins/admins.service';
import { FullSubscriptionDto } from './dtos/full-subscription.dto';
import { reactivateSubscriptionDto } from './dtos/reactivate-subscription.dto';
import { changePlanDto } from './dtos/change-plan.dto';

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
  createSubscription(data: FullSubscriptionDto) {
    return this.subscriptionsRepository.createSubscription(data)
  }

  canceledSubscription(subscription_id: string) {
    return this.subscriptionsRepository.canceledSubscription(subscription_id)
  }

  reactivateSubscription(data: reactivateSubscriptionDto) {
    return this.subscriptionsRepository.reactivateSubscription(data)
  }

  changePlan(data: changePlanDto) {
    return this.subscriptionsRepository.changePlan(data)
  }
}