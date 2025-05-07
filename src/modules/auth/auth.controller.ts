import { Controller, Post, Body, UnauthorizedException, InternalServerErrorException, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpAuthDto } from './dtos/signup-auth.dto';
import { loginAuthDto } from './dtos/signin-auth.dto';
import { sign } from 'crypto';
import { createAdmin } from './dtos/createAdmin.dto';
import { payloadGoogle } from './dtos/signinGoogle.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Role } from 'src/enums/roles.enum';
import { Roles } from 'src/decorators/role.decorator';
import { RolesGuard } from 'src/guards/role.guard';

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

  @Post('signUpAdmin')
  signUpAdmin(@Body() signUpAdmin: createAdmin) {
    return this.authService.signUpAdmin(signUpAdmin);
  }
  
  @ApiBearerAuth()
  @Post('signUpUser')
  @UseGuards(AuthGuard)
  async signUp(@Body() signUpUser: SignUpAuthDto, @Req() req: Request & { user: any }) {
    //el endpoint signInStore crea la tienda y el usuario
  }
  
  @ApiBearerAuth()
  @Post('signUpStore')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  signInStore(@Body() userAndStore: SignUpAuthDto, @Req() req: Request & { user: any } ) {
    return this.authService.buildStore(userAndStore, req);
  }

  @Post('signinGoogle')
  signinGoogle(@Body() payload: payloadGoogle ) {
    try {
      console.log(payload);
      
      return this.authService.signinGoogle(payload)
    } catch (error) {
      throw new InternalServerErrorException('Ocurrió un error inesperado. No se pudo autenticar');
    }
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
