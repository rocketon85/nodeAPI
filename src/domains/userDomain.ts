import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class UserDomain {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    password: string
}