import { Chapiter } from 'src/module/chapter/entities/chapter.entity';
import { User } from 'src/module/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('course')
export class Course {
  @ApiProperty({ description: 'Unique course ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Introduction to Python', description: 'Course title' })
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiProperty({ example: 'Learn Python from scratch', description: 'Course description' })
  @Column({ type: 'varchar', length: 255 })
  description: string;

  @ApiProperty({ description: 'Course completion progress (0-100)', default: 0 })
  @Column({ type: 'int', default: 0 })
  progress: number;

  @ApiProperty({ example: 5, description: 'Number of chapters' })
  @Column({ type: 'int' })
  chapiter_count: number;

  @ApiProperty({ example: true, description: 'Whether to include YouTube video recommendations', default: false })
  @Column({ type: 'boolean', default: false })
  include_video: boolean;

  @ApiProperty({ example: 'NestJS', description: 'Technology stack', nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  tech_stack: string;

  @ApiProperty({ enum: ['beginner', 'intermediate', 'advanced'], example: 'beginner', description: 'Course difficulty level' })
  @Column({
    type: 'enum',
    enum: ['beginner', 'intermediate', 'advanced'],
  })
  difficulty: 'beginner' | 'intermediate' | 'advanced';

  @ApiProperty({ description: 'Course creation timestamp' })
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

  //Relationships

  @ManyToOne(() => User, (user) => user.courses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Chapiter, (chapiter) => chapiter.course, { onDelete: 'CASCADE' })
  chapiters: Chapiter[];
}
