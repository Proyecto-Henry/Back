import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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
import { Admin } from 'src/entities/Admin.entity'
import { Role } from 'src/enums/roles.enum';
import { User } from 'src/entities/User.entity';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/common/nodemailer.service';
import { payloadGoogle } from './dtos/signinGoogle.dto';
import { StoresService } from '../stores/stores.service';
import { Request } from 'express';
import { Store } from 'src/entities/Store.entity';
import { Status_Sub } from 'src/enums/status_sub.enum';
import { Super_Admin } from 'src/entities/Super_Admin.entity';
import { SuperAdminService } from '../superAdmins/supers.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly adminsService: AdminsService,
    private readonly subscriptionService: SubscriptionsService,
    private readonly countryService: CountryService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly storesService: StoresService,
    private readonly superAdminService: SuperAdminService,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Store)
    private readonly storesRepository: Repository<Store>,
  ) {}

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
    let user: Admin | User | Super_Admin | null = null;
    let role: Role | null = null;

    const loginChecks: {
      searchUser: () => Promise<Admin | User | Super_Admin | null>;
      role: Role;
    }[] = [
      {
        searchUser: () =>
          this.superAdminService.getSuperAdminByEmail(loginUser.email),
        role: Role.SUPER_ADMIN,
      },
      {
        searchUser: () => this.adminsService.getAdminByEmail(loginUser.email),
        role: Role.ADMIN,
      },
      {
        searchUser: () => this.usersService.getUserByEmail(loginUser.email),
        role: Role.USER,
      },
    ];

    // Ejecutar los chequeos en orden
    for (const check of loginChecks) {
      console.log(loginUser.email)
      const userFound = await check.searchUser();
      console.log(userFound)
      if (userFound) {
        user = userFound;
        role = check.role;
        break;
      }
    }
    if (!user || !role)
      throw new UnauthorizedException('❌Credenciales inválidas');

    const validPassword = await bcrypt.compare(
      loginUser.password,
      user.password,
    );

    if (!validPassword)
      throw new UnauthorizedException('❌Credenciales inválidas');

    if (user instanceof Admin && user.status === Status_User.INACTIVE) {
      throw new UnauthorizedException('❌Su cuenta ha sido suspendida por violar los Términos de Uso.');
    } else if (user instanceof User && user.status === Status_User.INACTIVE) {
      throw new UnauthorizedException('❌Su cuenta ha sido suspendida.');
    }
    
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      status: (user as User | Admin).status,
      role: role,
    };
    const token = this.jwtService.sign(payload);

    const userData = {
        name: user.name ,
        id: user.id,
        email: user.email,
        role: role,
        img_profile: (user as Admin).img_profile
    };
    
    // Verificar si la suscripción está vencida
    if (role === Role.ADMIN) {
      const subscription = await this.subscriptionRepository.findOne({
        where: { admin: { email: user.email } },
      });

      if (!subscription) {
        throw new NotFoundException(
          'Suscripción no encontrada para el administrador',
        );
      }
      const now = new Date();
      if (now > subscription.end_date) {
        // Actualizar el estado de la suscripción a 'paused'
        subscription.status = Status_Sub.PAUSED;
        await this.subscriptionRepository.save(subscription);
      }
    }
    // const { password, ...userWithoutPassword } = user
    let userMessage
    if (role === Role.USER) {
      userMessage = "✅Login exitoso! Bienvenido"
      return {
        message: userMessage,
        token: token,
        user: userData,
    };
    }
    return {
        message: `✅Login exitoso! Bienvenido/a ${user.name}`,
        token: token,
        user: userData,
    };
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
    // Buscar el país por id
    const countryEntity = admin.country
      ? await this.countryService.findCountryById(admin.country)
      : null;

    if (admin.country && !countryEntity) {
      throw new Error('País no encontrado');
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
    const newAdmin = {
      ...admin,
      email: admin.email.trim().toLowerCase(),
      password: hashedPassword,
      status: Status_User.ACTIVE,
      phone: admin.phone,
      created_at: new Date(),
      country: countryEntity || undefined,
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
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // creo el usuario
    const newUser = this.userRepository.create({
      ...user,
      email: user.email.trim().toLowerCase(),
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
    // revisar el tipo de plan en la suscripción del administrador
    const subscription = await this.subscriptionRepository.findOne({
      where: { admin: { id: req.user.id } },
    });

    if (!subscription) {
      throw new NotFoundException(
        'Suscripción no encontrada para el administrador',
      );
    }

    // Verificar si el admin tiene una suscripción de prueba
    if (subscription.status === 'trial') {
      // Contar las tiendas existentes del admin
      const storeCount = await this.storesRepository.count({
        where: { admin: { id: req.user.id }, status: true },
      });

      if (storeCount >= 1) {
        throw new BadRequestException(
          'Los administradores con suscripción de prueba solo pueden tener una tienda',
        );
      }
    }

    if (subscription.status === 'active' && subscription.plan === '1 store') {
      // Contar las tiendas existentes del admin
      const storeCount = await this.storesRepository.count({
        where: { admin: { id: req.user.id }, status: true },
      });

      if (storeCount >= 1) {
        throw new BadRequestException(
          "Los administradores con suscripción '1 store' solo pueden tener una tienda",
        );
      }
    }

    if (subscription.status === 'active' && subscription.plan === '2 stores') {
      // Contar las tiendas existentes del admin
      const storeCount = await this.storesRepository.count({
        where: { admin: { id: req.user.id }, status: true },
      });

      if (storeCount >= 2) {
        throw new BadRequestException(
          "Los administradores con suscripción '2 stores' solo pueden tener 2 tiendas",
        );
      }
    }

    if (subscription.status === 'active' && subscription.plan === '4 stores') {
      // Contar las tiendas existentes del admin
      const storeCount = await this.storesRepository.count({
        where: { admin: { id: req.user.id }, status: true },
      });

      if (storeCount >= 4) {
        throw new BadRequestException(
          "Los administradores con suscripción '4 stores' solo pueden tener 4 tiendas",
        );
      }
    }
    if(subscription.status === 'cancelled') {
      throw new BadRequestException(
          "Cancelaste la suscripción, no podés agregar una tienda",
      );
    }
    // controlo que la direccion no se repita
    const existAddress = await this.storesService.findAddress(
      userStore.address,
    );

    if (existAddress)
      throw new BadRequestException(
        'Parece que ya hay una tienda registrada en esa direccion',
      );

    // controlo que el usuario no exista
    const userAlreadyRegister = await this.usersService.getUserByEmail(
      userStore.email,
    );
    if (userAlreadyRegister)
      throw new BadRequestException(
        'Parece que ya hay un usuario registrado con dicho email',
      );
    // const validCountryCode = await this.countryService.findByCode(
    //   userStore.countryCode,
    // );
    // if (!validCountryCode)
    //   throw new BadRequestException('No existe el codigo de area');
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
        address: store.address,
      },
      user: {
        id: user.id,
        email: user.email,
      },
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
      await this.mailService.sendNotificationMail(admin.email);

      const payload = {
        id: admin.id,
        email: admin.email,
        status: admin.status,
        role: Role.ADMIN
      };
      const token = this.jwtService.sign(payload);

      const user = {
        name: admin.name,
        id: admin.id,
        email: admin.email,
        role: Role.ADMIN,
        img_profile: admin.img_profile
      };
      return {
        message: `✅Login exitoso! Bienvenido/a ${(admin as Admin).name}`,
        token: token,
        user: user,
      };
    } else if (googleId === admin.google_id) {
      if (admin.status === Status_User.INACTIVE) {
      throw new UnauthorizedException('❌Su cuenta ha sido suspendida por violar los Términos de Uso.');
      }
      const payload = {
        id: admin.id,
        email: admin.email,
        status: admin.status,
        role: Role.ADMIN,
      };
      const token = this.jwtService.sign(payload);

      const user = {
        name: admin.name,
        id: admin.id,
        email: admin.email,
        role: Role.ADMIN,
        img_profile: admin.img_profile
      };
      return {
        message: `✅Login exitoso! Bienvenido/a ${(admin as Admin).name}`,
        token: token,
        user: user,
      };
    } else {
      throw new UnauthorizedException('❌Credenciales inválidas');
    }
  }
}
