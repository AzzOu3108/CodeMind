import { Chapiter } from 'src/module/chapter/entities/chapter.entity';
import { ChapiterResource } from 'src/module/chapter_resources/entities/chapter_resource.entity';
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
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ['video'],
  })
  type: 'video';

  @Column({ type: 'varchar', length: 500 })
  url: string;

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
