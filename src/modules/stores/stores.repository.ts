import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from 'src/entities/Store.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StoresRepository {
  constructor(
    @InjectRepository(Store) private storesRepository: Repository<Store>,
  ) {}

  async getStoreAndProductsByStoreId(store_id: string) {
    const storeAndProducts = await this.storesRepository.findOne({
      where: { id: store_id },
      relations: {
        products: true
      }
    })
    if (!storeAndProducts) {
      throw new NotFoundException('Tienda no encontrada');
    }
    return storeAndProducts
  }

  async getStoresByAdmin(admin_id: string) {
    const stores = await this.storesRepository.find({
      where: {
        admin: {
          id: admin_id
        }
      }
    }) 
    if (!stores) {
      throw new NotFoundException('Tiendas no encontradas');
    }
    return stores
  }

}
