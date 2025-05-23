import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SubscriptionReminderService } from '../services/subscriptionReminder.service';

@Injectable()
export class SubscriptionReminderCron {
  private readonly logger = new Logger(SubscriptionReminderCron.name);

  constructor(
    private readonly reminderService: SubscriptionReminderService,
  ) {}
  @Cron('0 9 * * *')
  async handleReminder() {
    this.logger.log('⏰ Ejecutando recordatorio de membresías próximas a vencer');
    await this.reminderService.sendExpiringMembershipEmails();
  }
}