import { IsNotEmpty, IsString } from 'class-validator';

export class storeDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;
}
