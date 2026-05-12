import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { Course } from './entities/course.entity';
import { User } from 'src/module/user/entities/user.entity';
import { Chapiter } from 'src/module/chapter/entities/chapter.entity';
import { CourseChapiter } from '../course_chapter/entities/course_chapiter.entity';
import { GeminiModule } from 'src/gemini/gemini.module';
import { YoutubeModule } from 'src/youtube/youtube.module';


@Module({
  imports: [TypeOrmModule.forFeature([Course, User, Chapiter, CourseChapiter]),
  GeminiModule,
  YoutubeModule
  ],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService],
})
export class CourseModule {}
