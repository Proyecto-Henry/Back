import { Body, Controller, Delete, Get, HttpException, Param } from '@nestjs/common';
import { StoresService } from './stores.service';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get('store/:store_id')
    getStoreAndProductsByStoreId (@Param('store_id') store_id: string) {
        try {
            const storeAndProducts = this.storesService.getStoreAndProductsByStoreId(store_id)
            return storeAndProducts
        } catch (error) {
            throw error;
        }
    }

    @Get('admin/:admin_id')
    getStoresByAdmin (@Param('admin_id') admin_id: string) {
        try {
            const stores = this.storesService.getStoresByAdmin(admin_id)
            return stores
        } catch (error) {
            throw error
        }
    }

    @Get('user/:user_id')
    getStoreAndProductsByUserId (@Param('user_id') user_id: string) {
        try {
            const stores = this.storesService.getStoreAndProductsByUserId(user_id)
            return stores
        } catch (error) {
            throw error
        }
    }

    @Delete('/:store_id')
    deleteStore(@Param('store_id') store_id: string) {
        try {
            return this.storesService.deleteStore(store_id)
        } catch (error) {
            throw error
        }
    }
}
