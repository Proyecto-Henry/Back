import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/User.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}
  
  async findOneBy(id: string) {
    return this.usersRepository.findOneBy({ id });
  }
  
  async getUserByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email: email } });
    
  }

  async save(user: User) {
    return this.usersRepository.save(user);
  }
}
