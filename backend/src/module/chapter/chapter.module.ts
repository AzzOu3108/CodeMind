import { Module } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { ChapterController } from './chapter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chapiter } from './entities/chapiter.entity';
import { ChapiterResourcesModule } from 'src/module/chapiter_resources/chapiter_resources.module';

@Module({
  imports:[TypeOrmModule.forFeature([Chapiter]), ChapiterResourcesModule],
  controllers: [ChapterController],
  providers: [ChapterService],
  exports: [ChapterService]
})
export class ChapiterModule {}
