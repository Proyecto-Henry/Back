import { Controller, Get, NotFoundException, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { UUID } from 'crypto';
import { User } from 'src/entities/User.entity';

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

  @Get(':id')
  getUser(@Param('id', new ParseUUIDPipe()) id: UUID): Promise<User> {
    try {
      return this.usersService.findUser(id);
    } catch (error) {
      throw new NotFoundException(error.message)
    }
  }
}
