import { Injectable } from '@nestjs/common';
import { SignUpAuthDto } from './dtos/signup-auth.dto';
import { loginAuthDto } from './dtos/signin-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}


  async login(loginUser: loginAuthDto){
    return "Usuario logeado exitosamente"
  }


  async signUp(signUpUser: SignUpAuthDto){
    return "Usuario creado exitosamente"
  }
}
