import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from 'src/entities/Store.entity';
import { Repository } from 'typeorm';
import { uploadImageStoreDto } from './dtos/upload-image-store.dto';
import { SignUpAuthDto } from '../auth/dtos/signup-auth.dto';

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
    // Filtrar productos con status: true
    storeAndProducts.products = storeAndProducts.products.filter((product) => product.status === true);
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
    if (stores.length === 0) {
      throw new NotFoundException('Tiendas no encontradas');
    }
    return stores
  }

  async uploadImageStore(data: uploadImageStoreDto) {
    const store = await this.storesRepository.findOneBy({id: data.store_id})
    if(store) {
      if (data.img_store !== undefined) {
        store.img_store = data.img_store;
        await this.storesRepository.save(store)
        return {message: "Imagen cargada con éxito"}
      }
    }
  }

  async findAddress(address: string) {
    return this.storesRepository.findOne({
      where: {
        address: address
      }
    })
  }

  async save(store: SignUpAuthDto) {
    return this.storesRepository.save(store);
  }

  async getStoreAndProductsByUserId(user_id: string) {
    const storeAndProducts = await this.storesRepository.findOne({
      where: { user: { id: user_id } },
      relations: {
        products: true
      }
    })
    if (!storeAndProducts) {
      throw new NotFoundException('Tienda no encontrada');
    }
    // Filtrar productos con status: true
    storeAndProducts.products = storeAndProducts.products.filter((product) => product.status === true);
    return storeAndProducts
  }
}
