import { Injectable } from '@nestjs/common';
import { SalesRepository } from './sales.repository';

@Injectable()
export class SalesService {
  constructor(private readonly salesRepository: SalesRepository) {}

  GetSalesByStoreId(store_id: string) {
    return this.salesRepository.GetSalesByStoreId(store_id)
  }
}
