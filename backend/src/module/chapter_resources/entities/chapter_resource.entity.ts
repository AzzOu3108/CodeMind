import { Chapiter } from 'src/module/chapter/entities/chapter.entity';
import { Resources } from 'src/module/resources/entities/resources.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('chapiter_resources')
export class ChapiterResource {
  @ApiProperty({ description: 'Chapter ID (composite primary key)' })
  @PrimaryColumn()
  chapiter_id: number;

  @ApiProperty({ description: 'Resource ID (composite primary key)' })
  @PrimaryColumn()
  resource_id: number;

  @ManyToOne(() => Chapiter, (chapiter) => chapiter.chapiterResources, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'chapiter_id' })
  chapiter: Chapiter;

  @ManyToOne(() => Resources, (resources) => resources.chapiterResources, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'resource_id' })
  resources: Resources;
}
