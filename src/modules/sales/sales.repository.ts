import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sale } from 'src/entities/Sale.entity';
import { Sale_Detail } from 'src/entities/Sale_Detail.entity';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/product.service';
import { RegisterSaleDto } from './dtos/registerDate.dto';
import { Product } from 'src/entities/Product.entity';

@Injectable()
export class SalesRepository {
  
  constructor(
    @InjectRepository(Sale) private salesRepository: Repository<Sale>,
    @InjectRepository(Sale_Detail)
    private sale_detailsRepository: Repository<Sale_Detail>,
    private readonly productsService: ProductsService
  ) {}

  async GetSalesByStoreId(store_id: string) {
    const result = await this.salesRepository.find({
      where: {
        store: {
          id: store_id,
        },
        is_active: true
      },
      relations: {
        sale_details: {
          product: true
        }
      },
    })

    const sales = result.map((sale) => ({
      id: sale.id,
      date: sale.date,
      total: sale.total,
      sale_details: sale.sale_details.map((detail) => ({
        quantity: detail.quantity,
        product: {
          name: detail.product.name,
          price: detail.product.price,
        },
      }))
    }));

  
    
    if(sales.length === 0 ) {
      throw new NotFoundException('Ventas no encontradas');
    }
    return sales
  }
  
  async registerSale(saleData: RegisterSaleDto) {

    const sale_details = saleData.sale_details
    const products = await this.productsService.getProductsById(saleData)

    let total = 0
    
    for (const item of sale_details) {
      const product = products.find(p => p.id === item.product_id);
      if (product) {
        total += product.price * item.quantity;
      }
    }
    const sale = await this.salesRepository.save({
      date:saleData.date,
      total: total,
      sale_details: sale_details.map((item) => ({
        product: { id: item.product_id},
        quantity: item.quantity,
      })),
      store: { id: saleData.store_id}
    })

    const saleWithProduct = await this.salesRepository.findOne({
      where: { id: sale.id },
      relations: ['sale_details', 'sale_details.product'],
    });
    if(!saleWithProduct) {
      throw new NotFoundException('Ventas no encontrada');
    }

    const response = {
      id: saleWithProduct.id,
      date: saleWithProduct.date,
      total: saleWithProduct.total,
      sale_details: saleWithProduct.sale_details.map((detail) => ({
        quantity: detail.quantity,
        product: {
          name: detail.product.name,
          price: detail.product.price,
        },
      })),
    };

    for (const item of sale_details) {
      const product = products.find(p => p.id === item.product_id);
      if (product) {
        product.stock -= item.quantity;
        await this.productsService.updateProductStock(product.id, product.stock);
      }
    }

    return {
        message: 'Venta realizada con éxito',
        success: true,
        sale: response
    };
  }

  async getSaleById(sale_id: string) {
    const result = await this.salesRepository.findOne({
      where: { id: sale_id, is_active: true },
      relations: ['sale_details', "sale_details.product"], 
    });

    if(!result) throw new NotFoundException('Venta no encontrada');
    const sale = {
      id: result.id,
      date: result.date,
      total: result.total,
      sale_details: result.sale_details.map((detail) => ({
        quantity: detail.quantity,
        product: {
          name: detail.product.name,
          price: detail.product.price,
        },
      })),
    };
    return sale
  }

  async getAllSales() {
  const result = await this.salesRepository.find({
    where: { is_active: true },
    relations: ['sale_details', 'sale_details.product', 'store'],
    order: { date: 'DESC' },
  });

  const sales = result.map((sale) => ({
    id: sale.id,
    date: sale.date,
    total: sale.total,
    is_active: sale.is_active,
    store: sale.store,
    sale_details: sale.sale_details.map((detail) => ({
      quantity: detail.quantity,
      product: {
        name: detail.product.name,
        price: detail.product.price,
      },
    })),
  }));

  return sales;
}

async disableSale(sale_id: string) {
  const queryRunner = this.salesRepository.manager.connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const sale = await queryRunner.manager.findOne(Sale, {
      where: { id: sale_id, is_active: true },
      relations: { sale_details: { product: true } },
    });

    if (!sale) {
      throw new NotFoundException('Venta no encontrada');
    }


    if(!sale.is_active){
      throw new NotFoundException("Venta ya desactivada")
    }
    for (const detail of sale.sale_details) {
      const product = detail.product;
      if (!product) {
        throw new Error(`Producto no encontrado`);
      }
      product.stock += detail.quantity;
      await queryRunner.manager.save(Product, product);
    }

    sale.is_active = false;
    await queryRunner.manager.save(Sale, sale);

    await queryRunner.commitTransaction();
    return { message: 'Venta eliminada y stock restaurado' };
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}

async deleteSalesByStoreId(store_id: string) {
  const queryRunner = this.salesRepository.manager.connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const sales = await queryRunner.manager.find(Sale, {
    where: { store: { id: store_id }, is_active: true }
  });

  if (!sales) {
      throw new NotFoundException('Ventas no encontradas');
  }

  for (const sale of sales) {
    sale.is_active = false;
    await queryRunner.manager.save(Sale, sale);
  }

  await queryRunner.commitTransaction();
  return { message: 'Historial de ventas eliminado exitosamente' };
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}
}

