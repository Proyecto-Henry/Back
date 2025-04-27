import { Injectable } from '@nestjs/common';
import { AdminsRepository } from './admins.repository';
import { createAdmin } from '../auth/dtos/createAdmin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Admin } from 'src/entities/Admin.entity';
import { Status_User } from 'src/enums/status_user.enum';
import { CreateAdminWithGoogleDto } from './dtos/create-admin-google.dto';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminsRepository: AdminsRepository,
    // aca voy a ver si meto repository<admin>
  ) {}

  async getAdminByEmail(email: string) {
    return this.adminsRepository.getAdminByEmail(email);
  }

  getAdminById(admin_id: string) {
    return this.adminsRepository.getAdminById(admin_id);
  }

  disableAdmin(admin_id: string) {
    return this.adminsRepository.disableAdmin(admin_id);}

  // async createWithGoogle(data: CreateAdminWithGoogleDto): Promise<Admin> {
  //   const newAdmin = this.adminsRepository.create({
  //     name: `${data.firstname} ${data.lastname}`,
  //     email: data.email,
  //     password: null,
  //     google_id: data.googleId,
  //     img_profile: data.picture || 'https://example.com/default-image.jpg',
  //     status: Status_User.ACTIVE,
  //     created_at: new Date(),
  //     country: null,
  //   } as DeepPartial<Admin>); 

  //   return await this.adminsRepository.save(newAdmin);}

}
