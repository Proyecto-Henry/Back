import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "src/entities/Product.entity";
import { ProductsRepository } from "./product.repository";
import { ProductsService } from "./product.service";
import { ProductsController } from "./product.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Product])],
    providers: [ProductsService,ProductsRepository],
    controllers: [ProductsController],
    exports: []
})
export class ProductModule {}