import { RefreshToken } from "src/auth/entities/refresh.entity";
import { Course } from "src/module/course/entities/course.entity";
import { Progress } from "src/module/progress/entities/progress.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    fullname: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255, select:false })
    password: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    avatar: string | null;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'now()',
    })
    created_at: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp',
        default: () => 'now()',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updated_at: Date;

    
    @OneToMany(() => Course, (course) => course.user)
    courses: Course[];

    @OneToMany(()=> Progress, (p)=>p.user)
    progress: Progress[];
    
    @OneToMany(()=> RefreshToken, (refreshToken)=> refreshToken.user)
    refreshTokens: RefreshToken[]
}
