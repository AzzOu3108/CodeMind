import { Chapiter } from "src/module/chapter/entities/chapiter.entity";
import { Course } from "src/module/course/entities/course.entity";
import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";

@Entity('course_chapiter')
export class CourseChapiter {
    @PrimaryColumn()
    courseId: number;

    @PrimaryColumn()
    chapiterId: number;

    @ManyToOne(() => Course, (course) => course.courseChapiter)
    course: Course;

    @ManyToOne(() => Chapiter, (chapiter) => chapiter.courseChapiter)
    chapiter: Chapiter;

    @Column({ type: 'int' })
    order: number;
}
