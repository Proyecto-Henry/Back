import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class loginAuthDto {
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;

  /**
   * @example Str0ngP@ssw0rd
   */
  @IsNotEmpty()
  @IsString()
  password: string;
}
