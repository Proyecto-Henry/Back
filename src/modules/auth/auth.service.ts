import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
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

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;
  constructor(
    private readonly jwtService: JwtService,
    private readonly adminsService: AdminsService,
    private readonly subscriptionService: SubscriptionsService,
    private readonly countryService: CountryService,
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
    return 'Usuario logeado exitosamente';
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
