import { Injectable } from '@nestjs/common';
import { SalesRepository } from './sales.repository';
import { RegisterSaleDto } from './dtos/registerDate.dto';

@Injectable()
export class SalesService {
  constructor(private readonly salesRepository: SalesRepository) {}

  GetSalesByStoreId(store_id: string) {
    return this.salesRepository.GetSalesByStoreId(store_id)
  }

  registerSale(saleData: RegisterSaleDto) {
    return this.salesRepository.registerSale(saleData)
  }
}
