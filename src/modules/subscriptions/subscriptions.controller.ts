import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Get,
  Param,
  Req,
  RawBodyRequest,
  HttpCode,
  Header,
} from '@nestjs/common';

import { SubscriptionsService } from './subscriptions.service';
import { changePlanDto } from './dtos/change-plan.dto';
import { createSubscriptionDto } from './dtos/create-subscription.dto';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('admin/:admin_id')
  getSubscriptionByAdminId(@Param('admin_id') admin_id: string) {
    try {
      return this.subscriptionsService.getSubscriptionByAdminId(admin_id);
    } catch (error) {
      throw error
    }
  }

  @Get('user/:user_id')
  getSubscriptionByUserId(@Param('user_id') user_id: string) {
    try {
      return this.subscriptionsService.getSubscriptionByUserId(user_id);
    } catch (error) {
      throw error
    }
  }

  @Post('createSubscription')
  createSubscription(@Body() data: createSubscriptionDto) {
    try {
      this.subscriptionsService.createSubscription(data);
      return { success: true, message: 'Suscripción creada exitosamente.' };
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
      this.subscriptionsService.changePlan(data)
      return { success: true, message: 'Cambio de plan exitoso.' };
    } catch (error) {
      throw new HttpException('Error al actualizar el plan. intente más tarde', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  
  @Post('webhook')
  @HttpCode(200)
  handleWebhook(@Req() req: RawBodyRequest<Request>) {
    const signature = req.headers['stripe-signature'] as string;
    const rawBody = req.body
    if (!signature || !rawBody) {
      throw new Error('Faltan datos del webhook de Stripe');
    }
    return this.subscriptionsService.handleWebhook(rawBody, signature);
  }
}
