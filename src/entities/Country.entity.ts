import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Admin } from './Admin.entity';

@Entity({ name: 'countries' })
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  phone_code: string;

  @OneToMany(() => Admin, (admin) => admin.country)
  admins: Admin[];
}
