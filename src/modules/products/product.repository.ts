import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  // async getStockByStore(product_id: string[]) {
  //   return await this.productsRepository.find({
  //     where: { id: In(product_id) },
  //     relations: ['store'],
  //   });
  // }

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

    // Buscar la suscripción del administrador
    const subscription =
      await this.subscriptionsService.getSubscriptionByAdminId(
        createProductDto.admin_id,
      );

    if (!subscription) {
      throw new NotFoundException(
        'Suscripción no encontrada para el administrador',
      );
    }

    // Si la suscripción es de prueba, aplicar restricciones
    if (subscription.status === 'trial') {
      // Contar los productos activos (status: true) de la tienda
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
        status: true, // Filtrar productos con status: true
      },
    });
    return products;
  }

  async removeProduct(product_id: string): Promise<{ message: string }> {
    const product = await this.productsRepository.findOneBy({ id: product_id });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }
    product.status = false;
    await this.productsRepository.save(product);
    return { message: 'Producto eliminado correctamente' };
  }

  async updateProduct(product_id: string, updateProductDto: UpdateProductDto) {
    if (updateProductDto == null) {
      return { message: 'No se realizaron cambios' };
    }
    const cleanedDto = Object.entries(updateProductDto)
      .filter(([_, value]) => value !== undefined)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    if (Object.keys(cleanedDto).length === 0) {
      throw new BadRequestException(
        'No se proporcionaron campos válidos para actualizar',
      );
    }

    const existingProduct = await this.productsRepository.findOne({
      where: { id: product_id },
      relations: ['store'],
    });

    if (!existingProduct) {
      throw new NotFoundException('Producto no encontrado');
    }

    await this.productsRepository.update(product_id, updateProductDto);

    const updatedProduct = await this.productsRepository.findOne({
      where: { id: product_id },
      relations: ['store'],
    });

    return {
      message: 'Se realizaron cambios en el producto',
      product: updatedProduct,
    };
  }

  async findProductsById(id: UUID[]): Promise<Product[]> {
    return await this.productsRepository.find({
      where: { id: In(id) },
      relations: ['store'],
    });
  }
}
