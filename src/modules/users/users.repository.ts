import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities/User.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsersRepository{
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        private readonly jwtService: JwtService
    ) {}
    
}