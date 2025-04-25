import { Controller, Get, HttpException, Param } from '@nestjs/common';
import { SalesService } from './sales.service';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get('/:store_id')
        GetSalesByStoreId (@Param(':store_id') store_id: string) {
            try {
                const sales = this.salesService.GetSalesByStoreId(store_id)
                return sales
            } catch (error) {
                if (error instanceof HttpException) {
                    throw error;
                }
            }
    }
}
