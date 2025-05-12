import { IsUUID, IsString, IsNumber, IsInt, Min, MaxLength, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  stock_min: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsUUID()
  store_id: string;
}
  