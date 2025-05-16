import { Body, Controller, Get, Post } from "@nestjs/common";
import { SuperAdminService } from "./supers.service";
import { SuperAdminDto } from "./dtos/supers.dto";
import { Super_Admin } from "src/entities/Super_Admin.entity";

@Controller('super') 
export class SuperAdminController {

    constructor(
        private readonly superAdminService: SuperAdminService
    ){}

    @Get()
    getSuperAdmin(): Promise<Omit<Super_Admin,'password'>[]> {
        return this.superAdminService.getSuperAdmin();
    }

    @Post('admin')
    registerSuperAdmin(@Body() data: SuperAdminDto) {
        try {
            return this.superAdminService.register(data);
        } catch (error) {
            throw error
        }
    }

}
