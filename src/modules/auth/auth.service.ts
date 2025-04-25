import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { SignUpAuthDto } from './dtos/signup-auth.dto';
import { loginAuthDto } from './dtos/signin-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { AdminDto } from './dtos/admin-auth.dto';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { User } from 'src/entities/User.entity';
import { UsersService } from '../users/users.service';
import { first } from 'rxjs';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {
    // this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
  }

  // async verifyGoogleIdTokenAndLogin(idToken: string): Promise<{access_token: string}> {
  //   try { 
  //     const ticket = await this.googleClient.verifyIdToken({
  //       idToken: idToken,
  //       audience: process.env.GOOGLE_CLIENT_ID
  //     })
    
    // const payload = LoginTicket.getPayload()

    // if(!payload || !payload.email){
    //   throw new UnauthorizedException("Falta email o el token de google es invalido ")
    // }

    // const googleId = payload.sub
    // const email = payload.email
    // const firstname = payload.given_name
    // const lastname = payload.family_name;
    // const picture = payload.picture

    // //! falta logica para buscar al user en la db con userService ej
    // // await this.userService.findByEmail(email)
    // let user = null

    // if (!user){
    //   console.log(`Usuario no encontrado por email ${email}. Procede a crearse`)
    //   user = await this.usersService.create({
    //     googleId: googleId,
    //     email:email,
    //     firstname: firstname,
    //     lastname: lastname,
    //     picture: picture,


    //   })
    // }

    // const backendPayload = {
    //   email: user.email,
    //   sub: user.id,
    //   role: user.role
    // }

    // const accessToken = this.jwtService.sign(backendPayload)

    // return { access_token: accessToken}

    //  } catch (error){
    //   console.error("🔥 Error al verificar el Google ID Token:", error)
    //   if (error.message.includes("Token used too late") || error.message.includes("Invalid token signature")){
    //     throw new UnauthorizedException("Invalid or expired Google token")
    //   }
    //   //! Si fallo otra cosa tiramos este error generico x ahora
    //   throw new InternalServerErrorException("Fallo el proceso de autenticación")
    //  }
  // }

  // async login(loginUser: loginAuthDto) {
  //   return 'Usuario logeado exitosamente';
  // }

  // async signUp(signUpUser: SignUpAuthDto) {
  //   return 'Usuario creado exitosamente';
  // }

  // async signInAdmin(SignInAdmin: AdminDto) {
  //   return 'Admin logueado';
  // }

  // async signUpAdmin(SignUpAdmin: AdminDto) {
  //   return 'Admin registrado';
  // }
}
