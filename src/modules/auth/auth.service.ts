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
import { StoresService } from '../stores/stores.service';
import { Request } from 'express';
import { Store } from 'src/entities/Store.entity';

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
    private readonly storesService: StoresService,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Store)
    private readonly storesRepository: Repository<Store>,
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

    const validPassword = await bcrypt.compare(
      loginUser.password,
      userOrAdmin.password,
    );
    if (!validPassword) {
      throw new UnauthorizedException('❌Credenciales inválidas');
    }

    const payload = {
      id: userOrAdmin.id,
      email: userOrAdmin.email,
      status: userOrAdmin.status,
      role: role,
    };
    const token = this.jwtService.sign(payload);

    const message =
      role === Role.ADMIN
        ? `✅Login exitoso! Bienvenido ${(userOrAdmin as Admin).name}`
        : '✅Login exitoso! Bienvenido';

    const user = {
      name: (userOrAdmin as Admin).name,
      id: userOrAdmin.id,
      email: userOrAdmin.email,
      role: role,
    };

    return { message, token, user };
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
    await this.mailService.sendNotificationMail(newAdmin.email, admin.password);
    return {
      message: 'Usuario registrado con éxito, chequee su casilla de correo',
    };
  }

  //TODO REGISTRO DE USUARIO/VENDEDOR
  async signUpUser(user: SignUpAuthDto, admin: any, newStore: any) {
    // controlo que el usuario no exista
    const userAlreadyRegister = await this.usersService.getUserByEmail(
      user.email,
    );
    if (userAlreadyRegister)
      throw new BadRequestException(
        'Parece que ya hay un usuario registrado con dicho email',
      );
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // creo el usuario
    const newUser = this.userRepository.create({
      ...user,
      password: hashedPassword,
      admin: admin, // administrador asociado al usuario
      status: Status_User.ACTIVE,
      store: newStore, // tienda que administrara
    });
    const usuario = await this.usersService.save(newUser);
    console.log('👦usuario creado: ', usuario);

    // envio de notificacion por email
    await this.mailService.sendNotificationMail(usuario.email, user.password);

    return usuario;
  }

  //TODO CREAR TIENDA
  async buildStore(userStore: SignUpAuthDto, req: Request & { user: any }) {
    // controlo que la direccion no se repita
    const existAddress = await this.storesService.findAddress(
      userStore.address,
    );
    if (existAddress)
      throw new BadRequestException(
        'Parece que ya hay una tienda registrada en esa direccion',
      );

    // traigo las propiedades del administrador
    const admin = await this.adminsService.getAdminById(req.user.id);

    // creo la tienda
    const newStore = this.storesRepository.create({
      ...userStore,
      admin: admin,
      user: undefined,
    });
    const store = await this.storesRepository.save(newStore);
    console.log('🏪store creada: ', store);

    // creo el usuario
    const user = await this.signUpUser(userStore, admin, newStore);

    // actualizo la tienda con su usuario
    store.user = user;
    await this.storesRepository.save(store);

    return {
      message: `👍 se registro su nueva tienda ${store.name}`,
      store: {
        id: store.id,
        name: store.name,
        address: store.address
      },
      user: {
        id: user.id,
        email: user.email
      }
    };
  }

  async signinGoogle(payload: payloadGoogle) {
    const { googleId, name, email } = payload;
    const admin = await this.adminsService.getAdminByEmail(email);
    if (!admin) {
      const subscription = this.subscriptionService.addTrialSubscription();
      const admin = this.adminRepository.create({
        name: name,
        email: email,
        google_id: googleId,
        password: '',
        status: Status_User.ACTIVE,
        created_at: new Date(),
        subscription,
      });
      const result = await this.adminRepository.save(admin);
      subscription.admin = result;
      await this.subscriptionRepository.save(subscription);
      await this.mailService.sendNotificationMail(
        admin.email,
        'No ha registrado una password',
      );
      return {
        message: 'Usuario registrado con éxito, chequee su casilla de correo'
      };
    } else if (googleId === admin.google_id) {
      const user = {
        name: admin.name,
        id: admin.id,
        email: admin.email,
        role: Role.ADMIN
      };
      return {
        message: `✅Login exitoso! Bienvenido ${(admin as Admin).name}`,
        user: user,
      };
    } else {
      throw new UnauthorizedException('❌Credenciales inválidas');
    }
  }
}
