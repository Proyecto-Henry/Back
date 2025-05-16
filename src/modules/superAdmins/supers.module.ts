import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Super_Admin } from "src/entities/Super_Admin.entity";
import { SuperAdminService } from "./supers.service";
import { SuperAdminController } from "./supers.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Super_Admin])],
    providers: [SuperAdminService],
    controllers: [SuperAdminController]
})
export class SuperAdminModule {}
