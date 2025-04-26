import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsRepository } from './subscriptions.repository';
import { SubscriptionsController } from './subscriptions.controller';
import { Subscription } from 'src/entities/Subscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription])],
  providers: [SubscriptionsService, SubscriptionsRepository],
  controllers: [SubscriptionsController],
  exports: [SubscriptionsService],
})
export class SubscriptionModule {}
