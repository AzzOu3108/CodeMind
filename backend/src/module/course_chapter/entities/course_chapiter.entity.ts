
import { Chapiter } from "src/module/chapter/entities/chapter.entity";
import { Course } from "src/module/course/entities/course.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Index(['course', 'chapiter'], {unique:true})
@Entity('course_chapiter')
export class CourseChapiter {
    @PrimaryColumn()
    course_id: number;

    @PrimaryColumn()
    chapiter_id: number;

    @ManyToOne(() => Course, (course) => course.courseChapiter, {onDelete: 'CASCADE'})
    @JoinColumn({ name: 'course_id' })
    course: Course;

    @ManyToOne(() => Chapiter, (chapiter) => chapiter.courseChapiter, {onDelete: 'CASCADE'})
    @JoinColumn({ name: 'chapiter_id' })
    chapiter: Chapiter;

    @Column({ type: 'int' })
    order: number;

    @Column({ type: 'varchar', nullable: true })
    video_id: string;

    @Column({ type: 'varchar', nullable: true })
    video_title: string;

    @Column({ type: 'varchar', nullable: true })
    video_thumbnail: string;

    @Column({ type: 'varchar', nullable: true })
    video_url: string;
}
