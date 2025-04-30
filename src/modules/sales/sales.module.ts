import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { SalesRepository } from './sales.repository';
import { Sale_Detail } from 'src/entities/Sale_Detail.entity';
import { Sale } from 'src/entities/Sale.entity';
import { ProductModule } from '../products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, Sale_Detail]), ProductModule],
  providers: [SalesService, SalesRepository],
  controllers: [SalesController],
  exports: [],
})
export class SaleModule {}
