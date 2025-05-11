import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { User } from 'src/entities/User.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async findUserByEmail(email: string) {
    return await this.usersRepository.findOne({
      where: { email },
    });
  }

  async getAllUsers() {
    return await this.usersRepository.find({
      select: ['id', 'email', 'status'],
    });
  }

  async findUser(id: UUID) {
    const user = await this.usersRepository.findOne({ 
      where: { id },
      select: ['email', 'id', 'status']
     });
    return user ? user : 'Usuario no encontrado';
  }
}
