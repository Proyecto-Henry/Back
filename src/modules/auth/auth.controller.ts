import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpAuthDto } from './dtos/signup-auth.dto';
import { loginAuthDto } from './dtos/signin-auth.dto';
import { AdminDto } from './dtos/admin-auth.dto';
import { sign } from 'crypto';

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

  @Post('signInAdmin')
  signInAdmin(@Body() signInAdmin: AdminDto) {
    return this.authService.signInAdmin(signInAdmin);
  }

  @Post('signUpAdmin')
  signUpAdmin(@Body() signUpAdmin: AdminDto) {
    return this.authService.signUpAdmin(signUpAdmin);
  }

  @Post('test')
  test() {
    return 'llega al test';
  }
}
