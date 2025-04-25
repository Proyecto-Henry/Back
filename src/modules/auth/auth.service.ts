import { Injectable } from '@nestjs/common';
import { SignUpAuthDto } from './dtos/signup-auth.dto';
import { loginAuthDto } from './dtos/signin-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { AdminDto } from './dtos/admin-auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(loginUser: loginAuthDto) {
    return 'Usuario logeado exitosamente';
  }

  async signUp(signUpUser: SignUpAuthDto) {
    return 'Usuario creado exitosamente';
  }

  async signInAdmin(SignInAdmin: AdminDto) {
    return 'Admin logueado';
  }

  async signUpAdmin(SignUpAdmin: AdminDto) {
    return 'Admin registrado';
  }
}
