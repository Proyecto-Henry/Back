import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Product } from "./Product.entity"
import { Sale } from "./Sale.entity"

@Entity({ name: 'sale_details' })
export class Sale_Detail {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'int', nullable: false})
    quantity: number

    @ManyToOne(() => Product, (product) => product.sale_details)
    @JoinColumn({ name: 'product_id' })
    product: Product

    @ManyToOne(() => Sale, (sale) => sale.sale_details)
    sale: Sale

}