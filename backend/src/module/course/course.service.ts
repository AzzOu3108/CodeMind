import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { User } from 'src/module/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Chapiter } from 'src/module/chapter/entities/chapiter.entity';
import { CourseChapiter } from '../course_chapiter/entities/course_chapiter.entity';
import { GeminiService } from 'src/gemini/gemini.service';
import { YoutubeService, YoutubeVideo } from 'src/youtube/youtube.service';

@Injectable()
export class CourseService {
 constructor(
  @InjectRepository(Course)
  private readonly courseRepo: Repository<Course>,
  @InjectRepository(User)
  private userRepo: Repository<User>,
  @InjectRepository(Chapiter)
  private chapiterRepo: Repository<Chapiter>,
  @InjectRepository(CourseChapiter)
  private courseChapiterRepo: Repository<CourseChapiter>,

  private geminiService: GeminiService,
  private youtubeService: YoutubeService,
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

  const cached = existingCourse.find(
    c => c.difficulty === dto.difficulty && c.chapiter_count === dto.chapiter_count
  )

  if (cached) {
    const full = await this.findOne(cached.id);
    return this.formatCourseResponse(full);
  }

  const chapiterTitles = await this.geminiService.generateChapterTitles(
    dto.title,
    dto.chapiter_count,
    dto.difficulty,
    dto.description,
  );

  const course = this.courseRepo.create({
    title: dto.title.trim(),
    description: dto.description?.trim() ?? '',
    chapiter_count: dto.chapiter_count,
    include_video: dto.include_video,
    difficulty: dto.difficulty,
    progress: 0,
    user,
  });
  const savedCourse = await this.courseRepo.save(course);

  for (let i = 0; i < chapiterTitles.length; i++) {
    const chapterTitle = chapiterTitles[i];

    // generate content
    const content = await this.geminiService.generateChapterContent(
      dto.title,
      chapterTitle,
      dto.difficulty,
      i
    );

    // save chapiter
    const chapiter = this.chapiterRepo.create({ title: chapterTitle, content });
    const savedChapiter = await this.chapiterRepo.save(chapiter);

    // fetch video if requested
    let videoData: YoutubeVideo | null = null;
    if (dto.include_video) {
      videoData = await this.youtubeService.searchVideo(
        chapterTitle,
        dto.title,
        dto.difficulty
      );
    }

    // save join table row
    const courseChapiter = this.courseChapiterRepo.create({
      course_id: savedCourse.id,
      chapiter_id: savedChapiter.id,
      order: i + 1,
      video_id: videoData?.videoId ?? null,
      video_title: videoData?.title ?? null,
      video_thumbnail: videoData?.thumbnail ?? null,
      video_url: videoData?.url ?? null,
    } as Partial<CourseChapiter>);
    await this.courseChapiterRepo.save(courseChapiter);
  }

  // return full formatted response
  const fullCourse = await this.findOne(savedCourse.id);
  return this.formatCourseResponse(fullCourse);
}

private formatCourseResponse(course: Course) {
  return {
    id: course.id,
    title: course.title,
    description: course.description,
    difficulty: course.difficulty,
    chapiter_count: course.chapiter_count,
    include_video: course.include_video,
    created_at: course.created_at,
    chapters: course.courseChapiter.map(cc => ({
      id: cc.chapiter.id,
      order: cc.order,
      title: cc.chapiter.title,
      content: cc.chapiter.content,
      video: cc.video_id ? {
        videoId: cc.video_id,
        title: cc.video_title,
        thumbnail: cc.video_thumbnail,
        url: cc.video_url,
      } : null,
    })),
  };
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
