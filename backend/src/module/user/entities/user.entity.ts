import { RefreshToken } from 'src/auth/entities/refresh.entity';
import { Course } from 'src/module/course/entities/course.entity';
import { Progress } from 'src/module/progress/entities/progress.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user')
export class User {
  @ApiProperty({ description: 'Unique user ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  @Column({ type: 'varchar', length: 100 })
  fullname: string;

  @ApiProperty({ example: 'john@example.com', description: 'User email address' })
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @ApiProperty({ description: 'Hashed password (excluded from default queries)' })
  @Column({ type: 'varchar', length: 255, select: false })
  password: string;

  @ApiProperty({ description: 'Avatar URL or data URI', nullable: true })
  @Column({ type: 'text', nullable: true })
  avatar: string | null;

  @ApiProperty({ description: 'Account creation timestamp' })
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

  @OneToMany(() => Course, (course) => course.user, { onDelete: 'CASCADE' })
  courses: Course[];

  @OneToMany(() => Progress, (p) => p.user)
  progress: Progress[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];
}
