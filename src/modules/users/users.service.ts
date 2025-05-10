import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from 'src/entities/Store.entity';
import { User } from 'src/entities/User.entity';
import { Status_User } from 'src/enums/status_user.enum';
import { Repository } from 'typeorm';
import { Admin } from 'src/entities/Admin.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async findOneBy(id: string) {
    return this.usersRepository.findOneBy({ id });
  }

  async findUser(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['store', 'admin'],
    });

    if (!user) throw new BadRequestException('usuario no encontrado');
    return user;
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
}
