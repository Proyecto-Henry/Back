import { Plan } from "src/enums/plan.enum"

class createCustomerDto {
    name: string
    email: string
}

class createPlanDto {
    name: string
    amount: number
    interval: 'month'
}

class createSubscriptionDto {
    email: string
    customerId: string
    planId: string
    paymentMethod: string
    plan: Plan
}

export class FullSubscriptionDto {
    customer: createCustomerDto;
    plan: createPlanDto;
    subscription: createSubscriptionDto;
}