import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class SignInAuthDto {
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
  @IsNotEmpty()
  password: string;

}
