import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Super_Admin } from 'src/entities/Super_Admin.entity';
import { Repository } from 'typeorm';
import { SuperAdminDto } from './dtos/supers.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SuperAdminService {
  constructor(
    @InjectRepository(Super_Admin)
    private readonly supersRepo: Repository<Super_Admin>,
  ) {}

  async getSuperAdmin() {
    const supers = await this.supersRepo.find();
    return supers.map(({password, ...supers}) => supers)
  }

  async getSuperAdminByEmail(email: string) {
    return await this.supersRepo.findOne({
      where: { email },
    });
  }

  async register(data: SuperAdminDto) {
    const exist = await this.getSuperAdminByEmail(data.email);
    if (exist)
      throw new BadRequestException('Ya se encuentra registado con ese email');
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newSuper = this.supersRepo.create({
      ...data,
      email: data.email.trim().toLowerCase(),
      password: hashedPassword,
    });
    await this.supersRepo.save(newSuper);
    const { password, ...superWithoutPassword } = newSuper;
    const response = {
      user: superWithoutPassword,
      message: "Super-admin creado con éxito"
    }
    return response
  }
}
