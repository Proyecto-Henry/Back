import { Plan } from "src/enums/plan.enum";

export class reactivateSubscriptionDto {
    customerId: string;
    planId: Plan;
    email: string; // opcional, pero lo usás para buscar al admin
  }
  