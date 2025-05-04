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
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/common/nodemailer.service';
import { payloadGoogle } from './dtos/signinGoogle.dto';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;
  constructor(
    private readonly jwtService: JwtService,
    private readonly adminsService: AdminsService,
    private readonly subscriptionService: SubscriptionsService,
    private readonly countryService: CountryService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
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
        throw new UnauthorizedException('❌Credenciales inválidas');
      }
      role = Role.USER;
    }

    if (await bcrypt.compare(userOrAdmin.password, loginUser.password)) {
      throw new UnauthorizedException('❌Credenciales inválidas');
    }

    const payload = {
      id: userOrAdmin.id,
      email: userOrAdmin.email,
      status: userOrAdmin.status,
    };
    const token = this.jwtService.sign(payload);

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

    return { response, token };
  }

  //TODO ADMINISTRADOR
  async signUpAdmin(admin: createAdmin) {
    const existAdmin = await this.adminsService.getAdminByEmail(admin.email);
    if (existAdmin) {
      throw new BadRequestException(
        'Ups!🫢 Ya tenemos un usuario registrado con dicho email',
      );
    }
    const hashedPassword = await bcrypt.hash(admin.password, 10);
    if (!hashedPassword)
      throw new BadRequestException(
        'Algo salio mal durante el proceso de registro. Por favor intente de nuevo',
      );
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
    const newAdmin = {
      ...admin,
      password: hashedPassword,
      status: Status_User.ACTIVE,
      phone: admin.phone,
      created_at: new Date(),
      // country: existCountry,
      subscription,
    };
    const saveAdmin = await this.adminRepository.save(newAdmin);
    subscription.admin = saveAdmin;
    await this.subscriptionRepository.save(subscription);
    await this.mailService.sendNotificationMail(newAdmin, admin.password);
    return {
      message: 'Usuario registrado con éxito, chequee su casilla de correo',
    };
  }

  //TODO REGISTRO DE USUARIO/VENDEDOR
  async signUpUser(signUpUser: SignUpAuthDto, admin: any) {
    const userAlreadyRegister = await this.usersService.getUserByEmail(
      signUpUser.email,
    );
    if (userAlreadyRegister)
      throw new BadRequestException(
        'Parece que ya hay un usuario registrado con dicho email',
      );
    if (signUpUser.password != signUpUser.passwordConfirm)
      throw new BadRequestException('Las contraseñas deben cohincidir');
    const hashedPassword = await bcrypt.hash(signUpUser.password, 10);
    const newUser = this.userRepository.create({
      ...signUpUser,
      password: hashedPassword,
      admin: {id: admin.id},
      status: Status_User.ACTIVE
    });
    await this.usersService.save(newUser)
  }

  async signinGoogle(payload: payloadGoogle) {
    const { googleId, name, email } = payload;
    const admin = await this.adminsService.getAdminByEmail(email)
    if(!admin) {
        const subscription = this.subscriptionService.addTrialSubscription();
        const admin = this.adminRepository.create({
          name: name,
          email: email,
          google_id: googleId,
          password: '', 
          status: Status_User.ACTIVE,
          created_at: new Date(),
          subscription
        });
      const result = await this.adminRepository.save(admin);
      subscription.admin = result
      await this.subscriptionRepository.save(subscription);
      await this.mailService.sendNotificationMail(admin, 'No ha registrado una password')
      return { message: 'Usuario registrado con éxito, chequee su casilla de correo' };
    } else if (googleId === admin.google_id){
        return {
          message: `✅Login exitoso! Bienvenido ${(admin as Admin).name}`,
          user: admin
        }
    } else {
      throw new UnauthorizedException('❌Credenciales inválidas');
    }
  }
}
