import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { FullSubscriptionDto } from './dtos/full-subscription.dto';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post('createSubscription')
  createSubscription(@Body() data: FullSubscriptionDto) {
  try {
    return this.subscriptionsService.createSubscription(data);
  } catch (error) {
    throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

@Post('cancelledSubscription')
canceledSubscription(subscription_id: string) {
  return this.subscriptionsService.canceledSubscription(subscription_id)
}

}