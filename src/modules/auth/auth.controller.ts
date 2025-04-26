import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpAuthDto } from './dtos/signup-auth.dto';
import { loginAuthDto } from './dtos/signin-auth.dto';
import { sign } from 'crypto';
import { createAdmin } from './dtos/createAdmin.dto';

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

  @Post('test')
  test() {
    return 'llega al test';
  }
}
