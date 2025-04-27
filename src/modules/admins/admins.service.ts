import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Admin } from 'src/entities/Admin.entity';
import { Status_User } from 'src/enums/status_user.enum';
import { CreateAdminWithGoogleDto } from './dtos/create-admin-google.dto';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminsRepository: Repository<Admin>,
  ) {}

  async findById(id: string) {
    return this.adminsRepository.findOneBy({ id });
  }

  async findByEmail(email: string) {
    return this.adminsRepository.findOne({ where: { email: email } });
  }

  async createWithGoogle(data: CreateAdminWithGoogleDto): Promise<Admin> {
    const newAdmin = this.adminsRepository.create({
      name: `${data.firstname} ${data.lastname}`,
      email: data.email,
      password: null,
      google_id: data.googleId,
      img_profile: data.picture || 'https://example.com/default-image.jpg',
      status: Status_User.ACTIVE,
      created_at: new Date(),
      country: null,
    } as DeepPartial<Admin>); 

    return await this.adminsRepository.save(newAdmin);
  }
}
