import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from 'src/entities/Admin.entity';
import { Country } from 'src/entities/Country.entity';
import { Status_User } from 'src/enums/status_user.enum';
import { Repository } from 'typeorm';

@Injectable()
export class AdminsRepository {
  constructor(
    @InjectRepository(Admin) private adminsRepository: Repository<Admin>,
    @InjectRepository(Country) private countrysRepository: Repository<Country>,
    private readonly jwtService: JwtService,
  ) {}

  async getAdminById(email: string) {
    const admin = await this.adminsRepository.findOneBy({email: email})
    if(!admin) {
          throw new NotFoundException('Admin no encontrado');
    }
    return admin
  }

  async disableAdmin(admin_id: string) {
    const admin = await this.adminsRepository.findOneBy({id: admin_id})
    if(!admin) {
        throw new NotFoundException('Admin no encontrado');
    }
    admin.status = Status_User.INACTIVE
    await this.adminsRepository.save(admin)
  }
}
