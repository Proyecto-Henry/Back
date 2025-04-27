import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Country } from 'src/entities/Country.entity';
import { Store } from 'src/entities/Store.entity';
import { User } from 'src/entities/User.entity';
import { Status_User } from 'src/enums/status_user.enum';
import { CreateDateColumn } from 'typeorm';
import { Status_Sub } from 'src/enums/status_sub.enum';

export class createAdmin {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  imgProfile?: string;

  @IsString()
  @IsNotEmpty()
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
