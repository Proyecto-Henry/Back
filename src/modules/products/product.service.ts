import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './product.repository';
import { RegisterSaleDto } from '../sales/dtos/registerDate.dto';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { UUID } from 'crypto';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  // getStockByStore(product_id: string[]) {
  //   return this.productsRepository.getStockByStore(product_id);
  // }

  async getProductsById(saleData: RegisterSaleDto) {
    return this.productsRepository.getProductsById(saleData);
  }

  async updateProductStock(productId: string, newStock: number) {
    return this.productsRepository.updateProductStock(productId, newStock);
  }

  createProduct(createProductDto: CreateProductDto) {
    return this.productsRepository.createProduct(createProductDto);
  }

  updateProduct(product_id: string, updateProductDto: UpdateProductDto) {
    return this.productsRepository.updateProduct(product_id, updateProductDto);
  }

  findProductsByStoreId(store_id: string) {
    return this.productsRepository.findProductsByStoreId(store_id);
  }
  removeProduct(product_id: string) {
    return this.productsRepository.removeProduct(product_id);
  }

  findProductsById(id: UUID[]) {
    return this.productsRepository.findProductsById(id);
  }
}
