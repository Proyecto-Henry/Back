import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/User.entity';
import { Status_User } from 'src/enums/status_user.enum';
import { Repository } from 'typeorm';
import { UsersRepository } from './users.repository';
import { UUID } from 'crypto';

@Injectable()
export class UsersService {
  
  constructor(
    private readonly usersRepo: UsersRepository,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async findOneBy(id: string) {
    return this.usersRepository.findOneBy({ id });
  }

  async findUser(id: UUID) {
    return this.usersRepo.findUser(id);
  }

  async getAllUsers() {
    return this.usersRepo.getAllUsers();
  }

  async getUserByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email: email } });
  }

  async disableUser(user_id: string) {
    const user = await this.usersRepository.findOneBy({ id: user_id });
    if (!user) {
      throw new NotFoundException('User no encontrado');
    }
    user.status = Status_User.INACTIVE;

    await this.usersRepository.save(user);
  }

  async save(user: User) {
    return this.usersRepository.save(user);
  }

  async getUserByUserId(user_id: string) {
    return await this.usersRepository.findOne({
      where: { id: user_id },
      relations: ['store'],
      select: {
        id: true,
        email: true,
        store: true
      },
    });
  }

  deleteUserByStoreId(store_id: string) {
    return this.usersRepo.deleteUserByStoreId(store_id)
  }

  getUserWithAdmin(user_id: string) {
    return this.usersRepo.getUserWithAdmin(user_id)
  }
}