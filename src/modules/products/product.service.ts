import { Injectable } from "@nestjs/common";
import { ProductsRepository } from "./product.repository";

@Injectable()
export class ProductsService {
    constructor(private readonly productsRepository: ProductsRepository) {}

}