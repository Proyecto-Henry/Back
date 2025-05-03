import { Controller, Param, Patch } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch(':user_id')
  disableUser(@Param('user_id') user_id: string) {
    try {
      this.usersService.disableUser(user_id);
      return {
        message: 'User desactivado exitosamente',
      };
    } catch (error) {
        throw error;
    }
  }
}
