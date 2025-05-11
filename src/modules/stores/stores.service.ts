import { Injectable } from '@nestjs/common';
import { StoresRepository } from './stores.repository';
import { uploadImageStoreDto } from './dtos/upload-image-store.dto';
import { SignUpAuthDto } from '../auth/dtos/signup-auth.dto';

@Injectable()
export class StoresService {
  
  constructor(private readonly storesRepository: StoresRepository) {}

  getStoreAndProductsByStoreId(store_id: string) {
    return this.storesRepository.getStoreAndProductsByStoreId(store_id)
  }

  getStoresByAdmin(admin_id: string) {
    return this.storesRepository.getStoresByAdmin(admin_id)
  }

  uploadImageStore(data: uploadImageStoreDto) {
    return this.storesRepository.uploadImageStore(data)
  }

  findAddress(address: string) {
    return this.storesRepository.findAddress(address);
  }

  save(store: SignUpAuthDto) {
    return this.storesRepository.save(store);
  }

  getStoreAndProductsByUserId(user_id: string) {
    return this.storesRepository.getStoreAndProductsByUserId(user_id)
  }
}
