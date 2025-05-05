import { Injectable } from '@nestjs/common';
import { AdminsRepository } from './admins.repository';
import { createAdmin } from '../auth/dtos/createAdmin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Admin } from 'src/entities/Admin.entity';
import { Status_User } from 'src/enums/status_user.enum';
import { CreateAdminWithGoogleDto } from './dtos/create-admin-google.dto';
import { updateAdminDto } from './dtos/update-profile-admin.dto';
import { payloadGoogle } from '../auth/dtos/signinGoogle.dto';

@Injectable()
export class AdminsService {
  
  
  constructor(
    private readonly adminsRepository: AdminsRepository,
  ) {}
  
  async getAdminByEmail(email: string) {
    return this.adminsRepository.getAdminByEmail(email);
  }

  getAdminById(admin_id: string) {
    return this.adminsRepository.getAdminById(admin_id);
  }

  findAdminById(adminId: string) {
    return this.adminsRepository.findAdminById(adminId);
  }
  
  disableAdmin(admin_id: string) {
    return this.adminsRepository.disableAdmin(admin_id);
  }
  
  async createWithGoogle(data: CreateAdminWithGoogleDto): Promise<Admin> {
    return await this.adminsRepository.createWithGoogle(data);
  }
  
  updateProfileAdmin(data: updateAdminDto) {
    return this.adminsRepository.updateProfileAdmin(data)
  }
  
  getAdminsForSuperAdmin() {
    return this.adminsRepository.getAdminsForSuperAdmin()
  }
}
