import { CourseChapiter } from "src/module/course_chapiter/entities/course_chapiter.entity";
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
    is_completed: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamptz',
        default: () => 'now()',
    })
    created_at: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamptz',
        default: () => 'now()',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updated_at: Date;

    @OneToMany (()=> CourseChapiter, (cc)=> cc.chapiter)
    courseChapiter: CourseChapiter[];
}
