import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChapiterResource } from './entities/chapter_resource.entity';
import { Chapiter } from '../chapter/entities/chapter.entity';
import { Resources } from '../resources/entities/resources.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChapiterResource, Chapiter, Resources])],
  exports: [TypeOrmModule]
})
export class ChapiterResourcesModule {}
