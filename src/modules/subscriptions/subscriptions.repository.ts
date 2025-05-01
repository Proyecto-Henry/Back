import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from 'src/entities/Subscription.entity';
import { Plan } from 'src/enums/plan.enum';
import { Status_Sub } from 'src/enums/status_sub.enum';
import { Repository } from 'typeorm';
import { FullSubscriptionDto } from './dtos/full-subscription.dto';
import { StripeService } from 'src/common/stripe.service';

@Injectable()
export class SubscriptionsRepository {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
    private readonly stripeService: StripeService,
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
    return this.subscriptionsRepository.findOne({
      where: { admin: { id: adminId } },
      relations: ['admin'],
    });
  }
  createSubscription(data: FullSubscriptionDto) {
    return this.stripeService.createSubscription(data);
  }

  canceledSubscription(subscription_id: string) {
    return this.stripeService.canceledSubscription(subscription_id);
  }
}
