import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class createAdmin {
  /**
   * @example nombre
   */
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
   * @example Str0ngP@ssw0rd
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(15)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[=!@#$%^&*])[A-Za-z\d=!@#$%^&*]{8,15}$/,
    {
      message:
        'Debe contener al menos una letra minuscula, una letra mayuscula, un numero, un caracter especial !@#$%^&* y minimo 8 caracteres con maximo de 15',
    }
  )
  password: string;

  /**
   * @example example@gmail.com
   */
  @IsNotEmpty()
  @IsEmail()  
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;

  /**
   * @example +54
   */
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty({
        example: 1
  })
  @IsNumber()
  @IsOptional()
  country: number;

}
