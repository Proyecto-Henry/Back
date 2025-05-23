import { Body, Controller, Delete, Get, Param, Patch, Put } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { updateAdminDto } from './dtos/update-profile-admin.dto';
import { UUID } from 'crypto';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Get('stores/:adminId')
  getUsersStores(@Param('adminId') adminId: UUID) {
    try {
      return this.adminsService.getStoresByAdmin(adminId);
    } catch (error) {
      throw error;
    }
  }

  @Get(':admin_id')
  getAdminById(@Param('admin_id') admin_id: string) {
    try {
      const admin = this.adminsService.getAdminById(admin_id);
      return admin;
    } catch (error) {
        throw error;
    }
  }
  
  @Patch(':admin_id')
  disableAdmin(@Param('admin_id') admin_id: string) {
    try {
      return this.adminsService.disableAdmin(admin_id);
    } catch (error) {
        throw error;
    }
  }

  @Put()
  updateProfileAdmin(@Body() data: updateAdminDto ){
    return this.adminsService.updateProfileAdmin(data)
  }

  @Get()
  getAdminsForSuperAdmin() {
    return this.adminsService.getAdminsForSuperAdmin()
  }

  @Delete('/:admin_id')
  deleteAccount(@Param('admin_id') admin_id: string) {
    try {
      return this.adminsService.deleteAccount(admin_id)
    } catch (error) {
      throw error
    }
  }
}
