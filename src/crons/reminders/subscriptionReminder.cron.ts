import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SubscriptionReminderService } from '../services/subscriptionReminder.service';

@Injectable()
export class SubscriptionReminderCron {
  private readonly logger = new Logger(SubscriptionReminderCron.name);

  constructor(
    private readonly reminderService: SubscriptionReminderService,
  ) {}

  // @Cron('*/10 * * * * *') // 10 segundos
  

  // Todos los dias a las 9 AM 
  @Cron('0 9 * * *') // 9 AM
  async handleReminder() {
    this.logger.log('⏰ Ejecutando recordatorio de membresías próximas a vencer');
    await this.reminderService.sendExpiringMembershipEmails();
  }
}