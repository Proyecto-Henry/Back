import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/User.entity";
import { UsersService } from "../users/users.service";
import { UsersRepository } from "../users/users.repository";
import { AuthController } from "./auth.controller";
import { Country } from "src/entities/Country.entity";
import { Admin } from "src/entities/Admin.entity";
import { AdminsService } from "../admins/admins.service";
import { AdminsRepository } from "../admins/admins.repository";

@Module({
    imports: [TypeOrmModule.forFeature([Admin, User, Country])],
    providers: [AdminsService, AdminsRepository, UsersService, UsersRepository],
    controllers: [AuthController],
    exports: []
})
export class AuthModule {}