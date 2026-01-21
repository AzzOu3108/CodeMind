import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { User } from 'src/module/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Chapiter } from 'src/module/chapter/entities/chapiter.entity';

@Injectable()
export class CourseService {
 constructor(
  @InjectRepository(Course)
  private readonly courseRepo: Repository<Course>,
  @InjectRepository(User)
  private userRepo: Repository<User>,
  @InjectRepository(Chapiter)
  private chapiterRepo: Repository<Chapiter>
 ){}

  async create(dto: CreateCourseDto, userId: number) {
  const user = await this.userRepo.findOne({ where: { id: userId } });
  if (!user) throw new NotFoundException('User not found');

  const existingCourse = await this.courseRepo.find({
    where: {
      user: {id:userId},
      title: dto.title.trim()
    }
  })

  const levelOrder ={
    beginner: 1,
    intermediate: 2,
    advanced: 3,
  }

  const newlevel= levelOrder[dto.difficulty]

  const invalid = existingCourse.some(
    c => levelOrder[c.difficulty] >= newlevel
  )

  if(invalid){
    throw new BadRequestException(
      'You already have this course at the same or higher level. Please choose a higher difficulty.',
    );
  }

  const course = this.courseRepo.create({
    title: dto.title.trim(),
    description: dto.description.trim(),
    chapiter_count: dto.chapiter_count,
    include_video: dto.include_video,
    difficulty: dto.difficulty,
    progress: 0,
    user,
  });
  return this.courseRepo.save(course);
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

    if(course.courseChapiter && course.courseChapiter.length > 0){
      const chapiterIds = course.courseChapiter.map(cc => cc.chapiter.id);
      await this.chapiterRepo.delete(chapiterIds);
    }

    await this.courseRepo.remove(course)
  }
}
