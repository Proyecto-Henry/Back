import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { Store } from "./Store.entity"
import { Status_User } from "src/enums/status_user.enum"
import { Admin } from "./Admin.entity"

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
    email: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    password: string

    @Column({ type: 'enum',enum: Status_User })
    status: Status_User

    @OneToOne(() => Store, (store) => store.user)
    @JoinColumn({ name: 'store_id' })
    store: Store

    @ManyToOne(() => Admin, (admin) => admin.users)
    @JoinColumn({ name: 'admin_id' })
    admin: Admin;
}