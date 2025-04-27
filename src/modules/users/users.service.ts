import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUserByEmail(email: string) {
    return await this.usersRepository.findUserByEmail(email);
  }
}
