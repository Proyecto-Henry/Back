import { Injectable } from '@nestjs/common';
import { SubscriptionsRepository } from './subscriptions.repository';
import { FullSubscriptionDto } from './dtos/full-subscription.dto';

@Injectable()
export class SubscriptionsService {
  
  constructor(
    private readonly subscriptionsRepository: SubscriptionsRepository,
  ) {}

  addTrialSubscription() {
    return this.subscriptionsRepository.addTrialSubscription();
  }

  createSubscription(data: FullSubscriptionDto) {
    return this.subscriptionsRepository.createSubscription(data)
  }

  canceledSubscription(subscription_id: string) {
    return this.subscriptionsRepository.canceledSubscription(subscription_id)
  }
}
