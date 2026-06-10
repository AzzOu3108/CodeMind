import { Chapiter } from 'src/module/chapter/entities/chapter.entity';
import { ChapiterResource } from 'src/module/chapter_resources/entities/chapter_resource.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('resources')
export class Resources {
  @ApiProperty({ description: 'Unique resource ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ enum: ['video'], example: 'video', description: 'Resource type' })
  @Column({
    type: 'enum',
    enum: ['video'],
  })
  type: 'video';

  @ApiProperty({ example: 'https://www.youtube.com/watch?v=...', description: 'Resource URL' })
  @Column({ type: 'varchar', length: 500 })
  url: string;

  @ApiProperty({ description: 'Resource creation timestamp' })
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'now()',
  })
  created_at: Date;

  @OneToMany(() => ChapiterResource, (cr) => cr.resources)
  chapiterResources: ChapiterResource[];

  @ManyToMany(() => Chapiter, (c) => c.resources)
  chapiters: Chapiter[];
}
