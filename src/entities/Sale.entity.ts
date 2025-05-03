import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Store } from './Store.entity';
import { Sale_Detail } from './Sale_Detail.entity';

@Entity({ name: 'sales' })
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  total: number;

  @OneToMany(() => Sale_Detail, (sale_detail) => sale_detail.sale)
  sale_details: Sale_Detail[];

  @ManyToOne(() => Store, (store) => store.sales)
  @JoinColumn({ name: 'store_id' })
  store: Store;
}
