import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
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
import { OAuth2Client } from 'google-auth-library';
import { Role } from 'src/enums/roles.enum';
import { User } from 'src/entities/User.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;
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
  ) {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  //! Hay que cambiar a que sea con adminsService
  // async verifyGoogleIdTokenAndLogin(
  //   idToken: string,
  // ): Promise<{ access_token: string }> {
  //   try {
  //     const ticket = await this.googleClient.verifyIdToken({
  //       idToken: idToken,
  //       audience: process.env.GOOGLE_CLIENT_ID,
  //     });

  //     const payload = ticket.getPayload();

  //     if (!payload || !payload.email) {
  //       throw new UnauthorizedException(
  //         'Falta email o el token de google es invalido ',
  //       );
  //     }

  //     const googleId = payload.sub;
  //     const email = payload.email;
  //     const firstname = payload.given_name;
  //     const lastname = payload.family_name;
  //     const picture = payload.picture;

  //     //! FindByEmail en adminsService ya fue creado
  //     // await this.userService.findByEmail(email)
  //     let adminis = null;

  //     if (!adminis) {
  //       console.log(
  //         `Admin no encontrado por email ${email}. Procede a crearse`,
  //       );
  //       adminis = await this.adminsService.create({
  //         googleId: googleId,
  //         email: email,
  //         firstname: firstname,
  //         lastname: lastname,
  //         picture: picture,
  //       });
  //     }

  //     const backendPayload = {
  //       email: User.email,
  //       sub: User.id,
  //       role: user.role,
  //     };

  //     const accessToken = this.jwtService.sign(backendPayload);

  //     return { access_token: accessToken };
  //   } catch (error) {
  //     console.error('🔥 Error al verificar el Google ID Token:', error);
  //     if (
  //       error.message.includes('Token used too late') ||
  //       error.message.includes('Invalid token signature')
  //     ) {
  //       throw new UnauthorizedException('Invalid or expired Google token');
  //     }
  //     //! Si fallo otra cosa tiramos este error generico x ahora
  //     throw new InternalServerErrorException(
  //       'Fallo el proceso de autenticación',
  //     );
  //   }
  // }

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
    // const existCountry = await this.countryService.findCountry(
    //   admin.country.name,
    // );
    // console.log(existCountry);
    // if (!existCountry) {
    //   throw new BadRequestException(
    //     'Parece que el pais ingresado no se encuentra almacenado',
    //   );
    // }
    const subscription = this.subscriptionService.addTrialSubscription();
    await this.subscriptionRepository.save(subscription);
    const newAdmin = {
      ...admin,
      status: Status_User.ACTIVE,
      google_id: undefined,
      phone: admin.phone,
      created_at: new Date(),
      // country: existCountry,
      subscription,
    };
    const saveAdmin = await this.adminRepository.save(newAdmin);
    subscription.admin = saveAdmin
    await this.subscriptionRepository.save(subscription);
  }
}
