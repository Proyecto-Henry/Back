import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/Product.entity';
import { In, Repository } from 'typeorm';
import { RegisterSaleDto } from '../sales/dtos/registerDate.dto';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Product) private productsRepository: Repository<Product>,
  ) {}

  async getProductsById (saleData: RegisterSaleDto) {
    const sale_details = saleData.sale_details
    const productIds = sale_details.map((detail) => detail.product_id);

    const products = await this.productsRepository.find({
      where: {
        id: In(productIds),
        store: { id: saleData.store_id }
      }
    })
    return products
  }

  updateProductStock(productId: string, newStock: number) {
    return this.productsRepository.update(productId, { stock: newStock } )
  }
}
