import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { ProductsService } from "src/modules/products/product.service";

@Injectable()
export class ValidateProduct implements CanActivate {
    constructor(
        private readonly productService: ProductsService
    ){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const sale_detail = req.body.sale_details;

        const productsId = sale_detail.map((element) => element.product_id)

        const existingProducts = await this.productService.findProductsById(productsId)
        if(existingProducts.length !== productsId.length) throw new BadRequestException('Intenta adquirir un producto inexistente')
        return true;
    }
}