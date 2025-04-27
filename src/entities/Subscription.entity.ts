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
  /*
  @Column({ type: 'varchar', length: 255, nullable: false })
  external_subscription_id: string;
*/
  @OneToOne(() => Admin, (admin) => admin.subscription)
  @JoinColumn({ name: 'admin_id' })
  admin: Admin;
}
