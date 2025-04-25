import { Injectable } from '@nestjs/common';
import { AdminsRepository } from './admins.repository';

@Injectable()
export class AdminsService {
  constructor(private readonly adminsRepository: AdminsRepository) {}

  getAdminById(email: string) {
    return this.adminsRepository.getAdminById(email)
 }

 disableAdmin(admin_id: string) {
     return this.adminsRepository.disableAdmin(admin_id)
 }
}
