import { User } from "src/module/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ForeignKey, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('course')
export class Course {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.cours)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({type: 'varchar', length: 255})
    title: string;

    @Column({type: 'varchar', length:255})
    description: string;

    @CreateDateColumn({type: 'timestamp', name: 'created_at'})
    created_at: Date;
    
    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updated_at: Date;
}
