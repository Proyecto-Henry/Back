import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpAuthDto } from './dtos/signup-auth.dto';
import { loginAuthDto } from './dtos/signin-auth.dto';
import { sign } from 'crypto';
import { createAdmin } from './dtos/createAdmin.dto';

class GoogleTokenDto {
  idToken: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  signIn(@Body() loginUser: loginAuthDto) {
    return this.authService.login(loginUser);
  }

  @Post('signup')
  async signUp(@Body() signUpUser: SignUpAuthDto) {
    const newUser = await this.authService.signUp(signUpUser);
    return this.authService.signUp(signUpUser);
  }

  @Post('signUpAdmin')
  signUpAdmin(@Body() signUpAdmin: createAdmin) {
    return this.authService.signUpAdmin(signUpAdmin);
  }

  // @Post('signInAdmin')
  // signInAdmin(@Body() signInAdmin: AdminDto) {
  //   return this.authService.signInAdmin(signInAdmin);
  // }

  // @Post('google')
  // async googleLogin(@Body() googleTokenDto: GoogleTokenDto): Promise<{ access_token: string }> {
  //   try {
  //     if (!googleTokenDto.idToken) {
  //       throw new UnauthorizedException('No ID token provided');
  //     }
  //     // verifica y genera el token del backend
  //     const backendToken = await this.authService.verifyGoogleIdTokenAndLogin(googleTokenDto.idToken);
  //     return backendToken;
  //   } catch (error) {
  //     // Loguea el error real en el servidor
  //     console.error('Google login failed:', error.message);
  //     // Devuelve un error genérico al cliente
  //     throw new UnauthorizedException('Google authentication failed');
  //   }
  // }
}
