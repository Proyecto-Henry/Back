import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/Product.entity';
import { ProductsRepository } from './product.repository';
import { ProductsService } from './product.service';
import { ProductsController } from './product.controller';
import { Store } from 'src/entities/Store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Store])],
  providers: [ProductsService, ProductsRepository],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductModule {}
