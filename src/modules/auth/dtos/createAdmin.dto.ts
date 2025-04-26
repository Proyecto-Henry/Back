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
  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsOptional()
  phone: string;

  @IsNotEmpty()
  @IsOptional()
  imgProfile?: string;

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
