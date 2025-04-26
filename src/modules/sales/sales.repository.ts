import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sale } from 'src/entities/Sale.entity';
import { Sale_Detail } from 'src/entities/Sale_Detail.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SalesRepository {
  constructor(
    @InjectRepository(Sale) private salesRepository: Repository<Sale>,
    @InjectRepository(Sale_Detail)
    private sale_detailsRepository: Repository<Sale_Detail>,
  ) {}

  async GetSalesByStoreId(store_id: string) {
    const sales = await this.salesRepository.findOne({
      where: { id: store_id },
      relations: {
        sale_details: true 
      }
    })
    if(!sales) {
      throw new NotFoundException('Ventas no encontradas');
    }
    return sales
  }
  
}
