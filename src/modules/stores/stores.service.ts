import { Injectable } from '@nestjs/common';
import { StoresRepository } from './stores.repository';

@Injectable()
export class StoresService {
  constructor(private readonly storesRepository: StoresRepository) {}

  getStoreAndProductsByStoreId(store_id: string) {
    return this.storesRepository.getStoreAndProductsByStoreId(store_id)
  }

  getStoresByAdmin(admin_id: string) {
    return this.storesRepository.getStoresByAdmin(admin_id)
  }
}
