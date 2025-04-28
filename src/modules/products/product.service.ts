import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './product.repository';
import { RegisterSaleDto } from '../sales/dtos/registerDate.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async getProductsById (saleData: RegisterSaleDto) {
    return this.productsRepository.getProductsById(saleData)
  }

  async updateProductStock (productId: string, newStock: number) {
    return this.productsRepository.updateProductStock(productId, newStock)
  }
}
