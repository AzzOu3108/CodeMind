import { Chapiter } from "src/module/chapter/entities/chapiter.entity";
import { User } from "src/module/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity('progress')
export class Progress {
    @PrimaryColumn()
    user_id: number;

    @PrimaryColumn()
    chapiter_id: number;

    @Column({type:'boolean' })
    is_completed: boolean

    @Column({ type: 'timestamp', nullable: true })
    completed_at: Date;

    @ManyToOne(()=> User, (user) => user.progress, {onDelete: 'CASCADE'})
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(()=> Chapiter, (chapiter)=> chapiter.progress, {onDelete: 'CASCADE'})
    @JoinColumn({ name: 'chapiter_id' })
    chapiter: Chapiter;
}
