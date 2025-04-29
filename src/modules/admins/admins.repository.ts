import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from 'src/entities/Admin.entity';
import { Country } from 'src/entities/Country.entity';
import { Status_User } from 'src/enums/status_user.enum';
import { DeepPartial, Repository } from 'typeorm';
import { CreateAdminWithGoogleDto } from './dtos/create-admin-google.dto';
import { updateAdminDto } from './dtos/update-profile-admin.dto';

@Injectable()
export class AdminsRepository {
  
  constructor(
    @InjectRepository(Admin) private adminsRepository: Repository<Admin>,
    @InjectRepository(Country) private countrysRepository: Repository<Country>,
    private readonly jwtService: JwtService,
  ) {}

  async getAdminByEmail(email: string) {
    return await this.adminsRepository.findOne({
      where: { email },
    });
  }

  async getAdminById(admin_id: string) {
    const admin = await this.adminsRepository.findOneBy({ id: admin_id });
    if (!admin) {
      throw new NotFoundException('Admin no encontrado');
    }
    return admin;
  }

  async disableAdmin(admin_id: string) {
    const admin = await this.getAdminById(admin_id);
    admin.status = Status_User.INACTIVE;
    await this.adminsRepository.save(admin);
    return admin;
  }

  async createWithGoogle(data: CreateAdminWithGoogleDto): Promise<Admin> {
    const newAdmin = this.adminsRepository.create({
      name: `${data.firstname} ${data.lastname}`,
      email: data.email,
      password: undefined, 
      google_id: data.googleId,
      img_profile: data.picture || 'https://example.com/default-image.jpg',
      status: Status_User.ACTIVE,
      created_at: new Date(),
      country: undefined, 
      phone: undefined, // phone puede ser null
    } as DeepPartial<Admin>);

    return await this.adminsRepository.save(newAdmin);
  }

  async updateProfileAdmin(data: updateAdminDto) {
    const admin = await this.adminsRepository.findOneBy({id: data.admin_id})
    if(admin) {
      Object.keys(data).forEach(key => {
        admin[key] = data[key];
      });
      await this.adminsRepository.save(admin)
      return {message: 'El perfil fue actualizado con éxito'}
    }
    
  }
}
