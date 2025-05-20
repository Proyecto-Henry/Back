import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { User } from 'src/entities/User.entity';
import { Status_User } from 'src/enums/status_user.enum';
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

  async deleteUserByStoreId(store_id: string) {
    const user = await this.usersRepository.findOne({
      where: { store: { id: store_id } }
    })
    if (user) {
      user.status = Status_User.INACTIVE
      await this.usersRepository.save(user)
    }
  }

  async getUserWithAdmin(user_id: string) {
    const user = await this.usersRepository.findOne({
    where: { id: user_id },
    relations: { admin: true },
  })
  return user
  }
}
