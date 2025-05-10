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
    const sales = await this.salesRepository.find({
      where: {
        store: {
          id: store_id,
        },
      },
      relations: {
        sale_details: true,
      },
    })

    if(sales.length === 0 ) {
      throw new NotFoundException('Ventas no encontradas');
    }
    return sales
  }
  
  async registerSale(saleData: RegisterSaleDto) {

    const sale_details = saleData.sale_details
    const products = await this.productsService.getProductsById(saleData)

    //calculamos el total
    let total = 0
    
    for (const item of sale_details) {
      const product = products.find(p => p.id === item.product_id);
      if (product) {
        total += product.price * item.quantity;
      }
    }
    //realizamos la venta
    const sale = await this.salesRepository.save({
      date:saleData.date,
      total: total,
      sale_details: sale_details.map((item) => ({
        product: { id: item.product_id},
        quantity: item.quantity
      })),
      store: { id: saleData.store_id}
    })

    // actualizamos el stock de los productos vendidos
    for (const item of sale_details) {
      const product = products.find(p => p.id === item.product_id);
      if (product) {
        product.stock -= item.quantity;
        await this.productsService.updateProductStock(product.id, product.stock);
      }
    }
    return sale
  }

  async getSaleById(sale_id: string): Promise<Sale | null> {
    return await this.salesRepository.findOne({
      where: { id: sale_id },
      relations: ['sale_details', "sale_details.product"], 
    });
  }

  async getAllSales(): Promise<Sale[]> {
    return await this.salesRepository.find({
      relations: ['sale_details', "sale_details.product", 'store'], 
      order: { date: 'DESC' },
    });
  }


  async deleteSale(sale_id: string): Promise<number> {
    const result = await this.salesRepository.delete(sale_id);
    return result.affected ?? 0;
  }


}