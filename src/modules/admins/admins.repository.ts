import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from 'src/entities/Admin.entity';
import { Country } from 'src/entities/Country.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminsRepository {
  constructor(
    @InjectRepository(Admin) private adminsRepository: Repository<Admin>,
    @InjectRepository(Country) private countrysRepository: Repository<Country>,
    private readonly jwtService: JwtService,
  ) {}
}
