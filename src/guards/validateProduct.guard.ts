import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ProductsService } from 'src/modules/products/product.service';

@Injectable()
export class ValidateProduct implements CanActivate {
  constructor(private readonly productService: ProductsService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { sale_details, store_id } = req.body;

    if (!Array.isArray(sale_details) || sale_details.length === 0) {
      throw new BadRequestException(
        'Eliga el/los producto/s que desea adquirir',
      );
    }

    // obtengo un array de cada producto a comprar
    const productsId = sale_details.map((element) => element.product_id);

    // verifio que esten disponible
    const existingProducts =
      await this.productService.findProductsById(productsId);
    // if (existingProducts.length !== productsId.length)
    //   throw new BadRequestException(
    //     'Intenta adquirir producto/s inexistente/s',
    //   );

    // por cada pruducto en sale_details
    for (const detail of sale_details) {
      const { product_id, quantity } = detail;

      const product = existingProducts.find(
        (product) => product.id === product_id,
      );
      if (!product) {
        throw new BadRequestException(
          `El producto con ID ${product_id} no existe`,
        );
      }

      if (product.store.id !== store_id) {
        throw new BadRequestException(
          `El producto ${product.name} no pertenece a la tienda seleccionada`,
        );
      }

      if (product.stock < quantity) {
        throw new BadRequestException(
          `Cantidad solicitada (${quantity}) excede el stock disponible (${product.stock}) del producto ${product.name}`,
        );
      }
    }
    return true;
  }
}
