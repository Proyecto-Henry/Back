import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class UptimeTest {
  private readonly logger = new Logger(UptimeTest.name);
  private time = 0;

  @Cron(CronExpression.EVERY_MINUTE)
  handleCron() {
    this.time++;
    this.logger.log(`El proyecto lleva ${this.time} minuto(s) levantado`);
  }
}