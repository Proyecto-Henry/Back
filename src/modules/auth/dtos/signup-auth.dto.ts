import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpAuthDto {
  /**
   * @example Ferretería
   */
  @MaxLength(50, { message: 'El nombre no debe tener más de 50 caracteres.' })
  @MinLength(3, { message: 'El nombre debe tener al menos de 3 caracteres.' })
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
   * @example example@gmail.com
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * @example Str0ngP@ssw0rd
   */
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[=!@#$%^&*])[A-Za-z\d=!@#$%^&*]{8,15}$/,
    {
      message:
        'Debe contener al menos una letra minuscula, una letra mayuscula, un numero, un caracter especial !@#$%^&* y minimo 8 caracteres con maximo de 15',
    },
  )
  @IsString()
  password: string;

  @ApiProperty({ example: 'Av Salta 763' })
  @IsNotEmpty()
  @IsString()
  address: string;

}
