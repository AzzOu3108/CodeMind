import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'char', length:50})
    name: string;

    @Column({type: 'varchar', length: 10})
    password: string;

    @Column({type: 'varchar', length:50, unique: true})
    email: string;

    @CreateDateColumn({type: 'timestamp', name: 'created_at'})
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updated_at: Date;
}
