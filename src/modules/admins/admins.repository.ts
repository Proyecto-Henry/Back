import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from 'src/entities/Admin.entity';
import { Country } from 'src/entities/Country.entity';
import { Status_User } from 'src/enums/status_user.enum';
import { DeepPartial, Repository } from 'typeorm';
import { CreateAdminWithGoogleDto } from './dtos/create-admin-google.dto';
import { updateAdminDto } from './dtos/update-profile-admin.dto';
import { CreateStoreDto } from '../stores/dtos/CreateStore.Dto';
import { Store } from 'src/entities/Store.entity';
import { DataSource } from 'typeorm';
import { CreateStoreResponseDto } from '../stores/dtos/CreateStoreResponse.dto';
import { payloadGoogle } from '../auth/dtos/signinGoogle.dto';

@Injectable()
export class AdminsRepository {
  constructor(
    @InjectRepository(Admin) private adminsRepository: Repository<Admin>,
    @InjectRepository(Country) private countrysRepository: Repository<Country>,
    private dataSource: DataSource,
    private readonly jwtService: JwtService,
  ) {}

  async getAdminByEmail(email: string) {
    return await this.adminsRepository.findOne({
      where: { email },
    });
  }

  async getAdminById(admin_id: string) {
    const admin = await this.adminsRepository.findOneBy({ id: admin_id });
    if (!admin) {
      throw new NotFoundException('Admin no encontrado');
    }
    return admin;
  }

  async findAdminById(adminId: string) {
    try {
      const admin = await this.adminsRepository.findOne({
        where: { id: adminId },
        relations: ['users'],
      });
      return admin;
    } catch (error) {
      return { message: 'admin no encontrado', error };
    }
  }

  async disableAdmin(admin_id: string) {
    const admin = await this.getAdminById(admin_id);
    if (admin.status === Status_User.ACTIVE) {
      admin.status = Status_User.INACTIVE;
      const result = await this.adminsRepository.save(admin);
      return {
        message: 'Usuario desactivado con éxito',
        status: result.status,
      };
    } else {
      admin.status = Status_User.ACTIVE;
      const result = await this.adminsRepository.save(admin);
      return {
        message: 'Usuario activado con éxito',
        status: result.status,
      };
    }
  }

  async createWithGoogle(data: CreateAdminWithGoogleDto): Promise<Admin> {
    const newAdmin = this.adminsRepository.create({
      name: `${data.firstname} ${data.lastname}`,
      email: data.email,
      password: undefined,
      google_id: data.googleId,
      img_profile: data.picture || 'https://example.com/default-image.jpg',
      status: Status_User.ACTIVE,
      created_at: new Date(),
      country: undefined,
      phone: undefined,
    } as DeepPartial<Admin>);

    return await this.adminsRepository.save(newAdmin);
  }

  async createStore(adminId: string, data: CreateStoreDto): Promise<CreateStoreResponseDto> {
    const admin = await this.adminsRepository.findOne({
      where: { id: adminId },
      relations: ['stores'],
    });

    if (!admin) {
      throw new NotFoundException('No se encontro al administrador');
    }

    const createdStore = this.dataSource
      .getRepository(Store)
      .create({ ...data, admin });

   await this.dataSource.getRepository(Store).save(createdStore);

   return new CreateStoreResponseDto(createdStore)
  }

  async updateProfileAdmin(data: updateAdminDto) {
    const admin = await this.adminsRepository.findOneBy({ id: data.admin_id });
    if (admin) {
      Object.keys(data).forEach((key) => {
        admin[key] = data[key];
      });
      await this.adminsRepository.save(admin);
      return { message: 'El perfil fue actualizado con éxito' };
    }
  }

  async getAdminsForSuperAdmin() {
    const result = await this.adminsRepository.find({
      relations: ['stores', 'subscription'],
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        stores: true,
        subscription: {
          id: true,
          status: true,
          start_date: true,
        },
      },
    });

    const admins = result.map((admin) => ({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      status: admin.status,
      storesCount: admin.stores.length,
      subscription: {
        status: admin.subscription.status,
        start_date: admin.subscription.start_date,
      },
    }));

    return admins;
  }
}
