import { Injectable } from '@nestjs/common';
import { AdminsRepository } from './admins.repository';
import { createAdmin } from '../auth/dtos/createAdmin.dto';

@Injectable()
export class AdminsService {
  constructor(private readonly adminsRepository: AdminsRepository) {}

  async getAdminByEmail(email: string) {
    return this.adminsRepository.getAdminByEmail(email);
  }

  getAdminById(email: string) {
    return this.adminsRepository.getAdminById(email);
  }

  disableAdmin(admin_id: string) {
    return this.adminsRepository.disableAdmin(admin_id);
  }
}
