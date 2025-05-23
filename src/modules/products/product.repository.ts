import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/Product.entity';
import { In, Repository } from 'typeorm';
import { RegisterSaleDto } from '../sales/dtos/registerDate.dto';
import { CreateProductDto } from './dtos/create-product.dto';
import { Store } from 'src/entities/Store.entity';
import { error } from 'console';
import { UpdateProductDto } from './dtos/update-product.dto';
import { UUID } from 'crypto';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Product) private productsRepository: Repository<Product>,
    @InjectRepository(Store) private storeRepository: Repository<Store>,
    private readonly subscriptionsService: SubscriptionsService
  ) {}
  
  async getProductsById(saleData: RegisterSaleDto) {
    const sale_details = saleData.sale_details;
    const productIds = sale_details.map((detail) => detail.product_id);

    const products = await this.productsRepository.find({
      where: {
        id: In(productIds),
        store: { id: saleData.store_id },
      },
    });
    return products;
  }

  updateProductStock(productId: string, newStock: number) {
    return this.productsRepository.update(productId, { stock: newStock });
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const store = await this.storeRepository.findOne({
      where: { id: createProductDto.store_id },
    });

    if (!store) {
      throw new error('Tienda no encontrada');
    }

    const subscription = await this.subscriptionsService.getSubscriptionByAdminId(createProductDto.admin_id);

    if (!subscription) {
      throw new NotFoundException('Suscripción no encontrada para el administrador');
    }

    if (subscription.status === 'trial') {
      const productCount = await this.productsRepository.count({
        where: { store: { id: store.id }, status: true },
      });

      if (productCount >= 10) {
        throw new BadRequestException(
          'Los administradores con suscripción de prueba solo pueden cargar hasta 10 productos en su tienda',
        );
      }
    }

    const newProduct = this.productsRepository.create({
      ...createProductDto,
      store,
    });

    return this.productsRepository.save(newProduct);
  }

  async findProductsByStoreId(store_id: string): Promise<Product[]> {
    const products = await this.productsRepository.find({
      where: {
        store: { id: store_id, status: true },
        status: true,
      },
    });
    return products
  }

  async removeProduct(product_id: string): Promise<{ message: string }> {
    const product = await this.productsRepository.findOneBy({id: product_id})
    
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }
    product.status = false
    await this.productsRepository.save(product)
    return { message: 'Producto eliminado correctamente' };
  }

  async updateProduct(product_id: string, updateProudctDto: UpdateProductDto) {
    await this.productsRepository.update(product_id, updateProudctDto);
    return this.productsRepository.findOne({
      where: { id: product_id },
      relations: ['store'],
    });
  }

  async findProductsById(id: UUID[]): Promise<Product[]> {
    return await this.productsRepository.find({
      where: {id: In(id)},
      relations: [ 'store' ]
    });
  }
}
