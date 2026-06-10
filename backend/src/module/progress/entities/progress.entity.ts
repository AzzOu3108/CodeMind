import { Chapiter } from 'src/module/chapter/entities/chapter.entity';
import { User } from 'src/module/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('progress')
export class Progress {
  @ApiProperty({ description: 'User ID (composite primary key)' })
  @PrimaryColumn()
  user_id: number;

  @ApiProperty({ description: 'Chapter ID (composite primary key)' })
  @PrimaryColumn()
  chapiter_id: number;

  @ApiProperty({ description: 'Whether the chapter is completed' })
  @Column({ type: 'boolean' })
  is_completed: boolean;

  @ApiProperty({ description: 'Completion timestamp', nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  completed_at: Date;

  @ManyToOne(() => User, (user) => user.progress, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Chapiter, (chapiter) => chapiter.progress, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'chapiter_id' })
  chapiter: Chapiter;
}
