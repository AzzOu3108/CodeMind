import { CourseChapiter } from "src/module/course_chapiter/entities/course_chapiter.entity";
import { Progress } from "src/module/progress/entities/progress.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('chapiter')
export class Chapiter {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 255})
    title: string;

    @Column({type: 'json'})
    content: string;

    @Column({type:'boolean'})
    is_completed: boolean;

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

    @OneToMany (()=> CourseChapiter, (cc)=> cc.chapiter)
    courseChapiter: CourseChapiter[];

    @OneToMany(()=> Progress, (p)=>p.chapiter)
    progress: Progress[];
}
