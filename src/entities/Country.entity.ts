import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { Admin } from './Admin.entity';

@Entity({ name: 'countries' })
export class Country {
  @PrimaryColumn('int')
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  phone_code: string;

  @OneToMany(() => Admin, (admin) => admin.country)
  admins: Admin[];
}
