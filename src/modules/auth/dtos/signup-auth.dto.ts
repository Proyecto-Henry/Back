import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpAuthDto {
  @MaxLength(50, { message: 'El nombre no debe tener más de 50 caracteres.' })
  @MinLength(3, { message: 'El nombre debe tener al menos de 3 caracteres.' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[=!@#$%^&*])[A-Za-z\d=!@#$%^&*]{8,15}$/,
    {
      message:
        'Debe contener al menos una letra minuscula, una letra mayuscula, un numero, un caracter especial !@#$%^&* y minimo 8 caracteres con maximo de 15',
    },
  )
  @IsString()
  password: string;

  // @IsNotEmpty()
  // @IsString()
  // passwordConfirm: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @MaxLength(30, {
    message: 'El numero de celular no debe tener más de 30 caracteres.',
  })
  @IsPhoneNumber(undefined, {
    message: 'El número de teléfono debe ser válido',
  })
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  countryId?: string;
}
