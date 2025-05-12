import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Country } from 'src/entities/Country.entity';
import { Store } from 'src/entities/Store.entity';
import { User } from 'src/entities/User.entity';
import { Status_User } from 'src/enums/status_user.enum';
import { CreateDateColumn } from 'typeorm';
import { Status_Sub } from 'src/enums/status_sub.enum';
import { Transform } from 'class-transformer';

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

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  imgProfile?: string;

  @IsString()
  @IsOptional()
  country: Country;

  @IsOptional()
  @IsString()
  googleId?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  /*
  users: User[];

  stores: Store[];
  */
}
