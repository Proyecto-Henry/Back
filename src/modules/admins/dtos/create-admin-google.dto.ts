import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateAdminWithGoogleDto {
  @IsString()
  googleId: string;

  @IsEmail()
  email: string;

  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsOptional()
  @IsString()
  picture?: string;
}
