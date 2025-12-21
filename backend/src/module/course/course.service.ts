import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { User } from 'src/module/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CourseService {
 constructor(
  @InjectRepository(Course)
  private readonly courseRepo: Repository<Course>
 ){}

  async create(dto:CreateCourseDto) {
    const course = this.courseRepo.create({
      title: dto.title.trim(),
      description: dto.description.trim(),
      chapiter_count: dto.chapiter_count,
      include_video: dto.include_video,
      difficulty: dto.difficulty,
      progress: 0,
      user: { id: dto.user_id } as User,
    })
    
    return this.courseRepo.save(course)
  }

  async findAll() {
    return this.courseRepo.find({
      order: {created_at: 'DESC'},
      relations:{
        courseChapiter:{
          chapiter: true
        }
      }
    })
  }

  async findOne(id: number) {
    const course = await this.courseRepo.findOne({
      where: {id},
      relations: {
        courseChapiter:{
          chapiter: true,
        }
      },
      order:{
        courseChapiter:{
          order: 'ASC'
        }
      }
    })

    if(!course){
      throw new NotFoundException('Course not found')
    }
    return course
  }

  async remove(courseId: number): Promise<void> {
    const course = await this.courseRepo.findOne({
      where: {id: courseId},
      relations:{ courseChapiter: {chapiter: true}},
    })

    if(!course){
      throw new NotFoundException('Course not found');
    }
    await this.courseRepo.remove(course)
  }
}
