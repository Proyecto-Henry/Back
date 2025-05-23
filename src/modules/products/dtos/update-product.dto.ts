import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsInt, Min } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({
    example: 250.75
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({
        example: 50
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;
}
