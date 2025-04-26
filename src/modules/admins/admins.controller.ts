import { Controller, Get, HttpException, Param, Patch } from '@nestjs/common';
import { AdminsService } from './admins.service';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Get(':email')
    getAdminById (@Param('email') email: string) {
        try {
            const admin = this.adminsService.getAdminById(email)
            return admin 
        } catch (error) {
            if (error instanceof HttpException) {
                // Si es NotFoundException, lo relanzamos
                throw error;
            }
        }
    }

    @Patch(':admin_id')
    disableAdmin (@Param('admin_id') admin_id: string) {
        try {
            this.adminsService.disableAdmin(admin_id)
            return {
                message: 'Admin desactivado exitosamente',
            }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
        }
    }
}
