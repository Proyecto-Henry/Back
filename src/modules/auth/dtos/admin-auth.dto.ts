import { IsArray, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Country } from 'src/entities/Country.entity';
import { Store } from 'src/entities/Store.entity';
import { User } from 'src/entities/User.entity';
import { Status_User } from 'src/enums/status_user.enum';

export class AdminDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  phone: number;

  @IsNotEmpty()
  status: Status_User;

  @IsNotEmpty()
  imgProfile: string;

  @IsNotEmpty()
  @IsArray()
  country: Country;

  users: User[];

  stores: Store[];
}
