import { ChapiterResource } from "src/module/chapiter_resources/entities/chapiter_resource.entity";
import { CourseChapiter } from "src/module/course_chapiter/entities/course_chapiter.entity";
import { Progress } from "src/module/progress/entities/progress.entity";
import { Resources } from "src/module/resources/entities/resources.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, ManyToMany, JoinTable } from "typeorm";

@Entity('chapiter')
export class Chapiter {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 255})
    title: string;

    @Column({type: 'varchar'})
    content: string;

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

    @OneToMany(() => CourseChapiter, (cc) => cc.chapiter, {onDelete: 'CASCADE'})
    courseChapiter: CourseChapiter[];

    @OneToMany(()=> Progress, (p)=>p.chapiter)
    progress: Progress[];

    @OneToMany(() => ChapiterResource, (cr) => cr.chapiter)
    chapiterResources: ChapiterResource[];

    @ManyToMany(() => Resources, (r) => r.chapiters)
    @JoinTable({
        name: 'chapiter_resources',
        joinColumn: { name: 'chapiter_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'resource_id', referencedColumnName: 'id' },
    })
    resources: Resources[];
} 
