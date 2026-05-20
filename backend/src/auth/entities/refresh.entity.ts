import { User } from "src/module/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('refresh_tokens')
export class RefreshToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', nullable: true })
    token_hash: string | null;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'now()',
    })
    created_at: Date;
    
    @Column({
        name: 'expires_at',
        type: 'timestamp',
        nullable: true,
    })
    expires_at: Date;


    @ManyToOne(()=> User, (user)=> user.refreshTokens, {onDelete: 'CASCADE'})
    @JoinColumn({ name: 'user_id' })
    user: User;
}