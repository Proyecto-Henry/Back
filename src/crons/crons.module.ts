import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { UptimeTest } from './uptimeTest.cron';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from 'src/entities/Subscription.entity';
import { SubscriptionReminderCron } from './reminders/subscriptionReminder.cron';
import { SubscriptionReminderService } from './services/subscriptionReminder.service';

@Module({
  imports: [ScheduleModule.forRoot(), TypeOrmModule.forFeature([Subscription])],
  providers: [UptimeTest, SubscriptionReminderCron, SubscriptionReminderService],
})
export class CronsModule {}