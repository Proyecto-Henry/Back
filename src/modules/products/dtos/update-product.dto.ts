import { IsOptional, IsString, MaxLength, IsNumber, IsInt, Min } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock_min?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;
}
