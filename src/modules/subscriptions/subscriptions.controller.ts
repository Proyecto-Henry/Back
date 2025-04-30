import { Controller, Get, Param } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}


  @Get(':admin_id')
  getSubscriptionByAdminId(@Param('admin_id') admin_id: string) {
    try {
      return this.subscriptionsService.getSubscriptionByAdminId(admin_id);
    } catch {}
  }
}
