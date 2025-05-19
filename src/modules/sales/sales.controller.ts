import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { RegisterSaleDto } from './dtos/registerDate.dto';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get()
  getAllSales() {
    return this.salesService.getAllSales();
  }

  @Get(':sale_id')
  getSaleById(@Param('sale_id', ParseUUIDPipe) sale_id: string) {
    return this.salesService.getSaleById(sale_id);
  }

  @Get('/store/:store_id')
  GetSalesByStoreId(@Param('store_id') store_id: string) {
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

  
  @Patch(':sale_id/disable')
  disableSale(@Param('sale_id') sale_id: string) {
    return this.salesService.disableSale(sale_id);
  }

  @Patch(':sale_id/enable')
  enableSale(@Param('sale_id') sale_id: string) {
    return this.salesService.enableSale(sale_id);
  }

  
  // @Delete(':sale_id')
  // deleteSale(@Param('sale_id', ParseUUIDPipe) sale_id: string) {
  //   return this.salesService.deleteSale(sale_id);
  // }
}
