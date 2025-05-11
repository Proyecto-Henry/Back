import { Injectable, NotFoundException } from '@nestjs/common';
import { SalesRepository } from './sales.repository';
import { RegisterSaleDto } from './dtos/registerDate.dto';

@Injectable()
export class SalesService {
  constructor(private readonly salesRepository: SalesRepository) {}
  async deleteSale(sale_id: string) {
    const deleted = await this.salesRepository.deleteSale(sale_id);
    if (!deleted) {
      throw new NotFoundException('Venta no encontrada');
    }
    return { message: 'Venta eliminada correctamente' };
  }
  async getSaleById(sale_id: string) {
    const sale = await this.salesRepository.getSaleById(sale_id);
    if (!sale) {
      throw new NotFoundException('Venta no encontrada');
    }
    return sale;
  }
  async getAllSales() {
    return await this.salesRepository.getAllSales();
  }

  GetSalesByStoreId(store_id: string) {
    return this.salesRepository.GetSalesByStoreId(store_id);
  }

  registerSale(saleData: RegisterSaleDto) {
    return this.salesRepository.registerSale(saleData);
  }

  DeleteSalesByStoreId(store_id: string) {
    return this.salesRepository.DeleteSalesByStoreId(store_id);
  }
}
