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
import { changePlanDto } from './dtos/change-plan.dto';
import { createSubscriptionDto } from './dtos/create-subscription.dto';

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
  createSubscription(@Body() data: createSubscriptionDto) {
    try {
      return this.subscriptionsService.createSubscription(data);
    } catch (error) {
      throw new HttpException('No se pudo realizar el pago. intente más tarde', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('canceledSubscription/:subscription_id')
  canceledSubscription(@Param('subscription_id') subscription_id: string) {
    try {
      this.subscriptionsService.canceledSubscription(subscription_id);
      return { success: true, message: 'Suscripción cancelada correctamente.' };
    } catch (error) {
      throw new HttpException('Error al cancelar la subscripción. intente más tarde', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('reactivateSubscription/:subscription_id')
  reactivateSubscription(@Param('subscription_id') subscription_id: string){
    try {
      this.subscriptionsService.reactivateSubscription(subscription_id)
      return { success: true, message: 'Suscripción reactivada correctamente.' };
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
