import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ProductsService } from './product.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }

  @Get(':store_id')
  findProductsByStoreId(@Param('store_id') store_id: string) {
    return this.productsService.findProductsByStoreId(store_id);
  }

  @Patch(':product_id')
  updateProduct(@Param('product_id') product_id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.updateProduct(product_id, updateProductDto);
  }

  @Delete(':product_id')
  removeProduct(@Param('product_id') product_id: string) {
    return this.productsService.removeProduct(product_id);
  }
}
