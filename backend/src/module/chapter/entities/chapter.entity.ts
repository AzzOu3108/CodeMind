import { ChapiterResource } from 'src/module/chapter_resources/entities/chapter_resource.entity';
import { Course } from 'src/module/course/entities/course.entity';
import { Lesson } from 'src/module/lesson/entities/lesson.entity';
import { Progress } from 'src/module/progress/entities/progress.entity';
import { Resources } from 'src/module/resources/entities/resources.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity('chapiter')
export class Chapiter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar' })
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

  @Column({ type: 'int', default: 0 })
  order: number;

  @ManyToOne(() => Course, (course) => course.chapiters, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @OneToMany(() => Progress, (p) => p.chapiter)
  progress: Progress[];

  @OneToMany(() => ChapiterResource, (cr) => cr.chapiter)
  chapiterResources: ChapiterResource[];

  @OneToMany(() => Lesson, (lesson) => lesson.chapiter, { cascade: true })
  lessons: Lesson[];

  @ManyToMany(() => Resources, (r) => r.chapiters)
  @JoinTable({
    name: 'chapiter_resources',
    joinColumn: { name: 'chapiter_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'resource_id', referencedColumnName: 'id' },
  })
  resources: Resources[];
}
