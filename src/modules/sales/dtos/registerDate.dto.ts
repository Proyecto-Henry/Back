import { IsUUID, IsDateString, IsPositive, IsInt, ArrayNotEmpty, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class SaleDetailDto {
  @IsUUID()
  product_id: string;

  @IsInt()
  @IsPositive()
  quantity: number;
}

export class RegisterSaleDto {
  @ApiProperty({ example: '2025-05-15 10:38:28.104' })
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