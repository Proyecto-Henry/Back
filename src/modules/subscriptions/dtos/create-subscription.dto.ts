import { IsString, IsNotEmpty, IsEmail, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { Plan } from 'src/enums/plan.enum';
import { ApiProperty } from '@nestjs/swagger';

class customerDto {

  /**
   * @example example@gmail.com
   */
  @IsNotEmpty()
  @IsEmail()
  email: string;

  /**
   * @example nombre
   */
  @IsString()
  @IsNotEmpty()
  name: string;
}

class planDto {
  @ApiProperty({ example: '1 store' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
        example: 10
  })
  @IsNumber()
  amount: number;

  /**
   * @example month
   */
  @IsString()
  @IsNotEmpty()
  interval: 'month';
}

class subscriptionDto {
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @IsString()
  @IsNotEmpty()
  plan: Plan;
}

export class createSubscriptionDto {
  @ValidateNested()
  @Type(() => customerDto)
  customer: customerDto;

  @ValidateNested()
  @Type(() => planDto)
  plan: planDto;

  @ValidateNested()
  @Type(() => subscriptionDto)
  subscription: subscriptionDto;
}