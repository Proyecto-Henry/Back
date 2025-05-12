import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { RegisterSaleDto } from './dtos/registerDate.dto';
import { ValidateStore } from 'src/guards/validateStore.guard';
import { ValidateProduct } from 'src/guards/validateProduct.guard';

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
  @UseGuards(ValidateStore, ValidateProduct)
  registerSale(@Body() saleData: RegisterSaleDto) {
    try {
      return this.salesService.registerSale(saleData);
    } catch (error) {
      throw error
    }
  }

  @Delete('/store/:store_id')
  DeleteSalesByStoreId(@Param('store_id') store_id: string) {
    try {
      return this.salesService.DeleteSalesByStoreId(store_id);
    } catch (error) {
        throw new HttpException('No se pudieron eliminar las ventas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':sale_id')
  deleteSale(@Param('sale_id', ParseUUIDPipe) sale_id: string) {
    try {
      return this.salesService.deleteSale(sale_id);
    } catch (error) {
      throw new HttpException('No se pudo eliminar la venta', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
