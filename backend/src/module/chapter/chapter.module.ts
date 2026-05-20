import { Module } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { ChapterController } from './chapter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chapiter } from './entities/chapter.entity';
import { ChapiterResourcesModule } from 'src/module/chapter_resources/chapter_resources.module';
import { CourseModule } from '../course/course.module';
import { CourseChapiter } from '../course_chapter/entities/course_chapiter.entity';
import { Lesson } from '../lesson/entities/lesson.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Chapiter, CourseChapiter, Lesson]),CourseModule , ChapiterResourcesModule],
  controllers: [ChapterController],
  providers: [ChapterService],
  exports: [ChapterService]
})
export class ChapiterModule {}
