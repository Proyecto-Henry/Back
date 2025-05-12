import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { StoresService } from "src/modules/stores/stores.service";

@Injectable()
export class ValidateStore implements CanActivate {
    constructor(
        private readonly storeService: StoresService
    ){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest()
        const storeId = req.body.store_id;
        const existStore = await this.storeService.findStoreById(storeId)
        if (!existStore) throw new BadRequestException('No existe la tienda')
        return true 
    }
}