import { User } from 'src/module/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('refresh_tokens')
export class RefreshToken {
  @ApiProperty({ description: 'Unique refresh token ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Bcrypt hash of the refresh token', nullable: true })
  @Column({ type: 'varchar', nullable: true })
  token_hash: string | null;

  @ApiProperty({ description: 'Token creation timestamp' })
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'now()',
  })
  created_at: Date;

  @ApiProperty({ description: 'Token expiration timestamp', nullable: true })
  @Column({
    name: 'expires_at',
    type: 'timestamp',
    nullable: true,
  })
  expires_at: Date;

  @ManyToOne(() => User, (user) => user.refreshTokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
