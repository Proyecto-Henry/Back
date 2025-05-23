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
import { Subscription } from 'src/entities/Subscription.entity';
import { User } from 'src/entities/User.entity';
import { Product } from 'src/entities/Product.entity';
import { Sale } from 'src/entities/Sale.entity';
import { UsersService } from '../users/users.service';
import { StripeService } from 'src/common/stripe.service';

@Injectable()
export class AdminsRepository {
  
  constructor(
    @InjectRepository(Admin) private adminsRepository: Repository<Admin>,
    private dataSource: DataSource,
    private readonly usersService: UsersService,
    // private readonly stripeService: StripeService
  ) {}

  async getAllAdmins() {
    const admin = await this.adminsRepository.find({
      relations: ['stores'],
      select: ['id', 'email', 'name', 'stores']
    })
    return admin ? admin : 'No se encontraron administradores';
  }
  
  async getStoresByAdmin(adminId: string) {
    const admin = await this.adminsRepository.findOne({
      where: { id: adminId },
      relations: ["stores"],
      select: ['id', 'stores', 'name', 'status',]
    });
    
    if (!admin) {
      return 'Administrador no encontrado';
    }
    admin.stores = admin.stores.filter((store) => store.status === true);
    return admin.stores.length ? admin.stores : 'No tiene tiendas asociadas';
  }

  async getAdminByEmail(email: string) {
    return await this.adminsRepository.findOne({
      where: { email },
    });
  }

  async getAdminById(admin_id: string) {
    const result = await this.adminsRepository.findOne({
      where: { id: admin_id },
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
          plan: true
        },
      },
    });


    if (!result) {
      throw new NotFoundException('Admin no encontrado');
    }
    result.stores = result.stores?.filter(store => store.status === true);
    const admin = {
      id: result.id,
      name: result.name,
      email: result.email,
      status: result.status,
      storesCount: result.stores.length,
      subscription: {
        status: result.subscription.status,
        start_date: result.subscription.start_date,
        plan: result.subscription.plan
      },
    };
    return admin
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
    const admin = await this.adminsRepository.findOne({
      where: { id: admin_id },
      relations: ['users'],
    })
    if(!admin) throw new NotFoundException('No se encontro al administrador');
    if (admin.status === Status_User.ACTIVE) {
      admin.status = Status_User.INACTIVE;
      // const admin_subscriptonId = admin.subscription.external_subscription_id
      // await this.stripeService.canceledSubscription(admin_subscriptonId)
      admin.users.forEach((user) => {user.status = Status_User.INACTIVE});
      const result = await this.adminsRepository.save(admin);

      return {
        message: 'Usuario desactivado con éxito',
        status: result.status,
      };
    } else {
      admin.status = Status_User.ACTIVE;
      admin.users.forEach((user) => {user.status = Status_User.ACTIVE});
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
          plan: true
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
        plan: admin.subscription.plan
      },
    }));

    return admins;
  }

  async deleteAccount(admin_id: string) {
    const queryRunner = this.adminsRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.delete(Subscription, { admin: { id: admin_id } });
      const stores = await queryRunner.manager.find(Store, { where: { admin: { id: admin_id } } });
      for (const store of stores) {
        await queryRunner.manager.delete(Sale, { store: store.id });
        await queryRunner.manager.delete(Product, { store: store.id });
      }
      await queryRunner.manager.delete(Store, { admin: { id: admin_id } });
      await queryRunner.manager.delete(User, { admin: { id: admin_id } });
      await queryRunner.manager.delete(Admin, { id: admin_id });
      await queryRunner.commitTransaction();
      return {
      success: true,
      message: "Cuenta eliminada con éxito"
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(`Error al eliminar la cuenta: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async getAdminByUserId(user_id: string) {
  const user = await this.usersService.getUserWithAdmin(user_id)
  return user?.admin
  }
}
