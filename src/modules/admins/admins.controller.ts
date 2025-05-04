import { Body, Controller, Get, HttpException, Param, Patch, Post, Put } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminWithGoogleDto } from './dtos/create-admin-google.dto';
import { updateAdminDto } from './dtos/update-profile-admin.dto';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

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

  @Post('google')
  async createWithGoogle(@Body() data: CreateAdminWithGoogleDto) {
    return this.adminsService.createWithGoogle(data);
  }

  @Put(':admin_id')
  updateProfileAdmin(@Body() data: updateAdminDto ){
    return this.adminsService.updateProfileAdmin(data)
  }

  @Get()
  getAdminsForSuperAdmin() {
    return this.adminsService.getAdminsForSuperAdmin()
  }
}
