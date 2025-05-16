import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post, Put } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminWithGoogleDto } from './dtos/create-admin-google.dto';
import { updateAdminDto } from './dtos/update-profile-admin.dto';
import { CreateStoreDto } from '../stores/dtos/CreateStore.Dto';
import { CreateStoreResponseDto } from '../stores/dtos/CreateStoreResponse.dto';
import { UUID } from 'crypto';
import { Admin } from 'src/entities/Admin.entity';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  //? ENDPOINT: RETORNA TODOS LOS ADMINS
  // @Get()
  // getAllAdmins(): Promise<Admin[]|string> {
  //   try {
  //     return this.adminsService.getAllAdmins();
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  //? ENDPOINT: RETORNA TODAS LAS TIENDAS POR ADMINISTRADOR
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

  // @Post('google')
  // async createWithGoogle(@Body() data: CreateAdminWithGoogleDto) {
  //   return this.adminsService.createWithGoogle(data);
  // }

  @Put()
  updateProfileAdmin(@Body() data: updateAdminDto ){
    return this.adminsService.updateProfileAdmin(data)
  }

  // @Post(":admin_id/createStore")
  // createStore(@Param("admin_id") adminId: string,@Body() data: CreateStoreDto): Promise<CreateStoreResponseDto> {
  //   return this.adminsService.createStore(adminId, data)
  // }

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
