import { CourseChapiter } from "src/module/course_chapter/entities/course_chapiter.entity";
import { User } from "src/module/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('course')
export class Course {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 255})
    title: string;

    @Column({type: 'varchar', length:255})
    description: string;

    @Column({type: 'int', default: 0})
    progress: number;

    @Column({type: 'int'})
    chapiter_count: number;

    @Column({type: 'boolean', default: false})
    include_video: boolean;

    @Column({
        type: 'enum',
        enum: ['beginner', 'intermediate', 'advanced' ]
    })
    difficulty: 'beginner'| 'intermediate'| 'advanced';

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

    //Relationships

    @ManyToOne(() => User, (user) => user.courses, {onDelete:'CASCADE'} )
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(()=> CourseChapiter, (cc)=>cc.course, {onDelete: 'CASCADE'})
    courseChapiter: CourseChapiter[];
}
