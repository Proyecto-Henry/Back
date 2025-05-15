import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, IsNumber, IsInt, Min } from 'class-validator';

export class UpdateProductDto {
  // @IsOptional()
  // @IsString()
  // @MaxLength(50)
  // name?: string;

  @ApiProperty({
    example: 250.75
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  // @IsOptional()
  // @IsInt()
  // @Min(0)
  // stock_min?: number;

  @ApiProperty({
        example: 50
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;
}
