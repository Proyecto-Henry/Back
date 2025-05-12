import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Observable } from "rxjs";
import { Product } from "src/entities/Product.entity";
import { Store } from "src/entities/Store.entity";
import { Repository } from "typeorm";

@Injectable()
export class DuplicatedProduct implements CanActivate {

    constructor(
        @InjectRepository(Store) private readonly storeRepo: Repository<Store>,
        @InjectRepository(Product) private readonly productRepo: Repository<Product>
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const {name, store_id} = req.body;

        const existStore = await this.storeRepo.findOne({
            where: { id: store_id}
        });
        if(!existStore) throw new BadRequestException('La tienda no existe')

        const newProduct = await this.productRepo.findOne({
            where: {
                name: name.toLowerCase().trim(),
                store: { id: store_id }
            },
            relations: ['store']
        })

        if(newProduct) throw new BadRequestException('El producto ya se encuentra agregado, editelo en su lugar') 
        return true;
    }
}