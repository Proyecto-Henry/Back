import { Controller, Get, HttpException, Param } from '@nestjs/common';
import { StoresService } from './stores.service';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get(':store_id')
    getStoreAndProductsByStoreId (@Param(':store_id') store_id: string) {
        try {
            const storeAndProducts = this.storesService.getStoreAndProductsByStoreId(store_id)
            return storeAndProducts
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
        }
    }

    @Get(':admin_id')
    getStoresByAdmin (@Param(':admin_id') admin_id: string) {
        try {
            const stores = this.storesService.getStoresByAdmin(admin_id)
            return stores
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
        }
    }
}
