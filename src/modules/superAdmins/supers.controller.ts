import { Body, Controller, Post } from "@nestjs/common";
import { SuperAdminService } from "./supers.service";
import { SuperAdminDto } from "./dtos/supers.dto";

@Controller('super') 
export class SuperAdminController {

    constructor(
        private readonly superAdminService: SuperAdminService
    ){}

    @Post('admin')
    registerSuperAdmin(@Body() data: SuperAdminDto) {
        return this.superAdminService.register(data);
    }

}
