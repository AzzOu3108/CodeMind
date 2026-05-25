import { Chapiter } from 'src/module/chapter/entities/chapter.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('lesson')
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ type: 'varchar', nullable: true })
  video_id: string;

  @Column({ type: 'varchar', nullable: true })
  video_title: string;

  @Column({ type: 'varchar', nullable: true })
  video_thumbnail: string;

  @Column({ type: 'varchar', nullable: true })
  video_url: string;

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

  // relation
  @ManyToOne(() => Chapiter, (chapiter) => chapiter.lessons, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'chapiter_id' })
  chapiter: Chapiter;
}
