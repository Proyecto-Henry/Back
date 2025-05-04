import { IsString, IsNotEmpty, IsEmail, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { Plan } from 'src/enums/plan.enum';

class customerDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

class planDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  amount: number;

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