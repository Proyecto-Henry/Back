import { Controller, Post, Body, InternalServerErrorException, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpAuthDto } from './dtos/signup-auth.dto';
import { loginAuthDto } from './dtos/signin-auth.dto';
import { createAdmin } from './dtos/createAdmin.dto';
import { payloadGoogle } from './dtos/signinGoogle.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Role } from 'src/enums/roles.enum';
import { Roles } from 'src/decorators/role.decorator';
import { RolesGuard } from 'src/guards/role.guard';

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
  @Post('signUpStore')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  signInStore(@Body() userAndStore: SignUpAuthDto, @Req() req: Request & { user: any } ) {
    return this.authService.buildStore(userAndStore, req);
  }

  @Post('signinGoogle')
  signinGoogle(@Body() payload: payloadGoogle ) {
    try {
      return this.authService.signinGoogle(payload)
    } catch (error) {
      throw new InternalServerErrorException('Ocurrió un error inesperado. No se pudo autenticar');
    }
    }
}
