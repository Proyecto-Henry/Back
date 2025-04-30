import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsRepository } from './subscriptions.repository';
import { SubscriptionsController } from './subscriptions.controller';
import { Subscription } from 'src/entities/Subscription.entity';
import { StripeService } from 'src/common/stripe.service';
import { AdminModule } from '../admins/admins.module';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription]), AdminModule],
  providers: [SubscriptionsService, SubscriptionsRepository, StripeService],
  controllers: [SubscriptionsController],
  exports: [SubscriptionsService],
})
export class SubscriptionModule {}
