import { Injectable } from '@nestjs/common';
import { SubscriptionsRepository } from './subscriptions.repository';
import { AdminsService } from '../admins/admins.service';

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
}
