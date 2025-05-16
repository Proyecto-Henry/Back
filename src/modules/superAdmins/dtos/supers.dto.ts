import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SuperAdminDto {
  /**
   * @example nombre
   */
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  
  @IsString()
  @IsNotEmpty()
  password: string;
}
