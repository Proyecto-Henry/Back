import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Country } from './Country.entity';
import { Store } from './Store.entity';
import { Status_User } from 'src/enums/status_user.enum';
import { Subscription } from './Subscription.entity';
import { User } from './User.entity';

@Entity({ name: 'admins' })
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  google_id: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  phone: string;

  @Column({
    type: 'varchar',
    length: 255,
    default: 'https://example.com/default-image.jpg',
  })
  img_profile: string;

  @Column({ type: 'enum', enum: Status_User })
  status: Status_User;

  @Column()
  created_at: Date;

  @ManyToOne(() => Country, (country) => country.admins)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @OneToMany(() => Store, (store) => store.admin)
  stores: Store[];

  @OneToMany(() => User, (user) => user.admin, { cascade: ['update'] })
  users: User[];

  @OneToOne(() => Subscription, (subscription) => subscription.admin)
  subscription: Subscription;
}
