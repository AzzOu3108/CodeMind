import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resources } from './entities/resources.entity';
import { ChapiterModule } from 'src/module/chapter/chapter.module';
import { ChapiterResourcesModule } from 'src/module/chapter_resources/chapter_resources.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Resources]),
    ChapiterModule,
    ChapiterResourcesModule,
  ],
})
export class ResourcesModule {}
