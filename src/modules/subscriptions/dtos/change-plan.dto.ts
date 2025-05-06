import { IsNotEmpty, IsString } from "class-validator";
import { Plan } from "src/enums/plan.enum";

export class changePlanDto {
    @IsString()
    @IsNotEmpty()
    subscription_id: string;
    @IsString()
    @IsNotEmpty()
    planId: Plan;
}