import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseChapiter } from './entities/course_chapiter.entity';
import { Course } from '../course/entities/course.entity';
import { Chapiter } from '../chapter/entities/chapter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourseChapiter, Chapiter, Course])],
  exports: [TypeOrmModule],
})
export class CourseChapiterModule {}
