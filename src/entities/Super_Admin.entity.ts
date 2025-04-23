import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity({ name: 'super_admins' })
export class Super_Admin {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', length: 50, nullable: false })
    name: string

    @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
    email: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    password: string
}