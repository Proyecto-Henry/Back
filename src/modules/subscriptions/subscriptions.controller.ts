import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Get,
  Param,
} from '@nestjs/common';

import { SubscriptionsService } from './subscriptions.service';
import { FullSubscriptionDto } from './dtos/full-subscription.dto';
import { reactivateSubscriptionDto } from './dtos/reactivate-subscription.dto';
import { changePlanDto } from './dtos/change-plan.dto';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get(':admin_id')
  getSubscriptionByAdminId(@Param('admin_id') admin_id: string) {
    try {
      return this.subscriptionsService.getSubscriptionByAdminId(admin_id);
    } catch {}
  }

  @Post('createSubscription')
  createSubscription(@Body() data: FullSubscriptionDto) {
    try {
      return this.subscriptionsService.createSubscription(data);
    } catch (error) {
      throw new HttpException('No se pudo realizar el pago. intente más tarde', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('cancelledSubscription/:subscription_id')
  canceledSubscription(@Param() subscription_id: string) {
    try {
      return this.subscriptionsService.canceledSubscription(subscription_id);
    } catch (error) {
      throw new HttpException('Error al cancelar la subscripción. intente más tarde', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('reactivateSubscription')
  reactivateSubscription(@Body() data: reactivateSubscriptionDto){
    try {
      return this.subscriptionsService.reactivateSubscription(data)
    } catch (error) {
      throw new HttpException('Error al reactivar la subscripción. intente más tarde', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('changePlan')
  changePlan(@Body() data: changePlanDto){
    try {
      return this.subscriptionsService.changePlan(data)
    } catch (error) {
      throw new HttpException('Error al actualizar el plan. intente más tarde', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
