import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpAuthDto } from './dtos/signup-auth.dto';
import { loginAuthDto } from './dtos/signin-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { createAdmin } from './dtos/createAdmin.dto';
import { Status_User } from 'src/enums/status_user.enum';
import { CountryService } from '../country/country.service';
import { AdminsService } from '../admins/admins.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from 'src/entities/Subscription.entity';
import { Repository } from 'typeorm';
import { Admin } from 'src/entities/Admin.entity';
import { Role } from 'src/enums/roles.enum';
import { UsersService } from '../users/users.service';
import { User } from 'src/entities/User.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly adminsService: AdminsService,
    private readonly subscriptionService: SubscriptionsService,
    private readonly countryService: CountryService,
    private readonly usersService: UsersService,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async login(loginUser: loginAuthDto) {
    let userOrAdmin: Admin | User | null;
    let role: Role;

    userOrAdmin = await this.adminsService.getAdminByEmail(loginUser.email);
    if (userOrAdmin) role = Role.ADMIN;
    else {
      userOrAdmin = await this.usersService.getUserByEmail(loginUser.email);
      if (!userOrAdmin) {
        throw new UnauthorizedException('Credenciales inválidas');
      }
      role = Role.USER;
    }

    if (loginUser.password != userOrAdmin.password) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const response = {
      message:
        role === Role.ADMIN
          ? `✅Login exitoso! Bienvenido ${(userOrAdmin as Admin).name}`
          : '✅Login exitoso! Bienvenido',
      user: {
        id: userOrAdmin.id,
        email: userOrAdmin.email,
        role: role,
      },
    };

    return response;
  }

  async signUp(signUpUser: SignUpAuthDto) {
    return 'Usuario creado exitosamente';
  }

  //? REGISTRO ADMINISTRADOR
  async signUpAdmin(admin: createAdmin) {
    const existAdmin = await this.adminsService.getAdminByEmail(admin.email);
    if (existAdmin) {
      throw new BadRequestException(
        'Ups!🫢 Ya tenemos un administrador registrado con dicho email',
      );
    }
    const existCountry = await this.countryService.findCountry(
      admin.country.name,
    );
    console.log(existCountry);
    if (!existCountry) {
      throw new BadRequestException(
        'Parece que el pais ingresado no se encuentra almacenado',
      );
    }
    const subscription = await this.subscriptionService.addTrialSubscription();
    const newAdmin = {
      ...admin,
      status: Status_User.ACTIVE,
      google_id: undefined,
      img_profile: admin.imgProfile || 'https://example.com/default-image.jpg',
      created_at: new Date(),
      country: existCountry,
      subscription,
    };
    await this.subscriptionRepository.save(subscription);
    return this.adminRepository.save(newAdmin);
  }
}
