import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Plan } from 'src/enums/plan.enum';
import { Status_Sub } from 'src/enums/status_sub.enum';
import { Admin } from './Admin.entity';

@Entity({ name: 'subscriptions' })
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: Plan })
  plan: Plan;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @Column({ type: 'enum', enum: Status_Sub })
  status: Status_Sub;

  // ID de suscripción de Stripe (ej. "sub_1RKtxeBdMx2Sby7CRFZxmXEN")
  @Column({ type: 'varchar', length: 255, nullable: true })
  external_subscription_id: string;

  // ID del item de suscripción de Stripe (ej. "si_SFOlk5GrGlP3zL")
  @Column({ type: 'varchar', length: 255, nullable: true })
  external_subscription_item_id: string;

  // ID del cliente de Stripe (ej. "cus_SFOlUBv9qHpfSZ")
  @Column({ type: 'varchar', length: 255, nullable: true })
  stripe_customer_id: string;

  // ID del plan/precio real en Stripe (ej. "plan_SFOlu53ZPlHB42")
  @Column({ type: 'varchar', length: 255, nullable: true })
  stripe_plan_id: string;

  @OneToOne(() => Admin, (admin) => admin.subscription)
  @JoinColumn({ name: 'admin_id' })
  admin: Admin;
}
