import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from 'src/entities/Store.entity';
import { Repository } from 'typeorm';
import { uploadImageStoreDto } from './dtos/upload-image-store.dto';
import { SignUpAuthDto } from '../auth/dtos/signup-auth.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class StoresRepository {
  
  constructor(
    @InjectRepository(Store) private storesRepository: Repository<Store>,
    private readonly usersService: UsersService
  ) {}

  async getStoreAndProductsByStoreId(store_id: string) {
    const storeAndProducts = await this.storesRepository.findOne({
      where: { id: store_id, status: true },
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
        },
        status: true
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
      where: { user: { id: user_id }, status: true },
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

  async findStoreById(id) {
    return await this.storesRepository.findOne({
      where: { id, status: true },
    })
  }

  async deleteStore(store_id: string) {
    const store = await this.storesRepository.findOne({
      where: { id: store_id  }
    })
    if(!store) {
      return {
        success: false,
        message: "tienda no encontrada"
      }
    }
    store.status = false
    await this.storesRepository.save(store)
    await this.usersService.deleteUserByStoreId(store_id)
    return {
      success: true,
      message: "Tienda eliminada con éxito"
    }
  }
}
