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
  async getSubscriptionByAdminId(@Param('admin_id') admin_id: string) {
    try {
      const result = await this.subscriptionsService.getSubscriptionByAdminId(admin_id);
      const {admin, ...subscription } = result
      return { success: true, message: "Suscripción obtenida con éxito.", subscription: subscription
      }
    } catch (error) {
      throw error
    }
  }

  @Get('user/:user_id')
  async getSubscriptionByUserId(@Param('user_id') user_id: string) {
    try {
      const result = await this.subscriptionsService.getSubscriptionByUserId(user_id);
      return { success: true, message: "Suscripción obtenida con éxito.", subscription: result
      }
    } catch (error) {
      throw error
    }
  }

  @Post('createSubscription')
  async createSubscription(@Body() data: createSubscriptionDto) {
    try {
      const result = await this.subscriptionsService.createSubscription(data);
      return { success: true, message: 'Suscripción creada exitosamente.', subscription: result };
    } catch (error) {
      throw new HttpException('No se pudo realizar el pago. intente más tarde', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('canceledSubscription/:subscription_id')
  async canceledSubscription(@Param('subscription_id') subscription_id: string) {
    try {
      const result = await this.subscriptionsService.canceledSubscription(subscription_id);
      return { success: true, message: 'Suscripción cancelada correctamente.', subscription: result };
    } catch (error) {
      throw new HttpException('Error al cancelar la subscripción. intente más tarde', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('reactivateSubscription/:subscription_id')
  async reactivateSubscription(@Param('subscription_id') subscription_id: string){
    try {
      const result = await this.subscriptionsService.reactivateSubscription(subscription_id)
      return { success: true, message: 'Suscripción reactivada correctamente.', subscription: result };
    } catch (error) {
      throw new HttpException('Error al reactivar la subscripción. intente más tarde', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('changePlan')
  async changePlan(@Body() data: changePlanDto){
    try {
      const result = await this.subscriptionsService.changePlan(data)
      return { success: true, message: 'Cambio de plan exitoso.', subscription: result };
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
