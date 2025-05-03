import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { RegisterSaleDto } from './dtos/registerDate.dto';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get('/:store_id')
  GetSalesByStoreId(@Param(':store_id') store_id: string) {
    try {
      const sales = this.salesService.GetSalesByStoreId(store_id);
      return sales;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
    }
  }

  @Post()
  registerSale(@Body() saleData: RegisterSaleDto) {
    return this.salesService.registerSale(saleData);
  }

  @Delete('/:store_id')
  DeleteSalesByStoreId(@Param(':store_id') store_id: string) {
    try {
      const sales = this.salesService.DeleteSalesByServicesId(store_id);
      return sales;
    } catch (error) {
      if (Error instanceof HttpException) {
        throw error;
      }
    }
  }
}
