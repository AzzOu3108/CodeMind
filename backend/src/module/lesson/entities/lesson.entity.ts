import { Chapiter } from 'src/module/chapter/entities/chapter.entity';
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ description: 'Unique lesson ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Variables and Data Types', description: 'Lesson title' })
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiProperty({ description: 'Lesson content in markdown with code blocks' })
  @Column({ type: 'text' })
  content: string;

  @ApiProperty({ description: 'Lesson order within the chapter', default: 0 })
  @Column({ type: 'int', default: 0 })
  order: number;

  @ApiProperty({ description: 'YouTube video ID', nullable: true })
  @Column({ type: 'varchar', nullable: true })
  video_id: string;

  @ApiProperty({ description: 'YouTube video title', nullable: true })
  @Column({ type: 'varchar', nullable: true })
  video_title: string;

  @ApiProperty({ description: 'YouTube video thumbnail URL', nullable: true })
  @Column({ type: 'varchar', nullable: true })
  video_thumbnail: string;

  @ApiProperty({ description: 'YouTube video URL', nullable: true })
  @Column({ type: 'varchar', nullable: true })
  video_url: string;

  @ApiProperty({ description: 'Lesson creation timestamp' })
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'now()',
  })
  created_at: Date;

  @ApiProperty({ description: 'Last update timestamp' })
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
