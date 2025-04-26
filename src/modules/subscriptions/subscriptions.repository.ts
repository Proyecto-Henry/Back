import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from 'src/entities/Subscription.entity';
import { Plan } from 'src/enums/plan.enum';
import { Status_Sub } from 'src/enums/status_sub.enum';
import { Repository } from 'typeorm';

@Injectable()
export class SubscriptionsRepository {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
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
      // external_subscription_id: '',
    });

    return newSubscription;
  }
}
