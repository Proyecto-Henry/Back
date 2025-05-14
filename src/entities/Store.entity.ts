import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Admin } from './Admin.entity';
import { User } from './User.entity';
import { Sale } from './Sale.entity';
import { Product } from './Product.entity';

@Entity({ name: 'stores' })
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  address: string;

  @Column({
    type: 'varchar',
    length: 255,
    default: 'https://example.com/default-image.jpg',
  })
  img_store: string;

  @Column({ default: true })
  status: boolean

  @ManyToOne(() => Admin, (admin) => admin.stores)
  @JoinColumn({ name: 'admin_id' })
  admin: Admin;

  @OneToOne(() => User, (user) => user.store)
  user: User;

  @OneToMany(() => Product, (product) => product.store)
  products: Product[];

  @OneToMany(() => Sale, (sale) => sale.store)
  sales: Sale[];
}
