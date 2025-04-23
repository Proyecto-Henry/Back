import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Store } from "./Store.entity"
import { Sale_Detail } from "./Sale_Detail.entity"

@Entity({ name: 'products' })
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', length: 50, nullable: false })
    name: string

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false})
    price: number

    @Column({ type: 'int', nullable: false})
    stock_min: number

    @Column({ type: 'int', nullable: false})
    stock: number

    @ManyToOne(() => Store, (store) => store.products)
    @JoinColumn({ name: 'store_id' })
    store: Store

    @OneToMany(() => Sale_Detail, (sale_detail) => sale_detail.product)
    sale_details: Sale_Detail[]
}