import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsNumber, IsInt, Min, MaxLength, IsOptional } from 'class-validator';

export class CreateProductDto {
  /**
   * @example martillo
   */
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({
      example: 250.75
  })
  @IsNumber()
  @Min(0)
  price: number;

  // @IsInt()
  // @Min(0)
  // @IsOptional()
  // stock_min: number;

  @ApiProperty({
      example: 50
  })
  @IsInt()
  @Min(0)
  stock: number;

  @IsUUID()
  store_id: string;

  @IsUUID()
  admin_id : string;
}
  