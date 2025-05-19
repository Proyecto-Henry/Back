import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

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
  // @Matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[=!@#$%^&*])[A-Za-z\d=!@#$%^&*]{8,15}$/,
  //   {
  //     message:
  //       'Debe contener al menos una letra minuscula, una letra mayuscula, un numero, un caracter especial !@#$%^&* y minimo 8 caracteres con maximo de 15',
  //   },
  // )
  password: string;
}
