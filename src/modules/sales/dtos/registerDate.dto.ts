import { IsUUID, IsDateString, IsPositive, IsInt, ArrayNotEmpty, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class SaleDetailDto {
  @IsUUID()
  product_id: string;

  @IsInt()
  @IsPositive()
  quantity: number;
}

export class RegisterSaleDto {
  @IsOptional()
  @IsDateString() //IsDateString para validar formato ISO
  date: string;

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SaleDetailDto)
  sale_details: SaleDetailDto[];

  @IsUUID()
  store_id: string;
}