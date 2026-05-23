import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { User } from 'src/module/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Chapiter } from 'src/module/chapter/entities/chapter.entity';
import { CourseChapiter } from '../course_chapter/entities/course_chapiter.entity';
import { Lesson } from 'src/module/lesson/entities/lesson.entity';
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
  @InjectRepository(Lesson)
  private lessonRepo: Repository<Lesson>,

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

  const courseStructure = await this.geminiService.generateCourseStructure(
    dto.title,
    dto.chapiter_count,
    dto.difficulty,
    dto.description,
  );

  const seenVideoIds = new Set<string>();

  for (let i = 0; i < courseStructure.length; i++) {
    const chapterData = courseStructure[i];

    // save chapiter
    const chapiter = this.chapiterRepo.create({
      title: chapterData.title,
      content: chapterData.content,
    });
    const savedChapiter = await this.chapiterRepo.save(chapiter);

    // save join table row
    const courseChapiter = this.courseChapiterRepo.create({
      course_id: savedCourse.id,
      chapiter_id: savedChapiter.id,
      order: i + 1,
    } as Partial<CourseChapiter>);
    await this.courseChapiterRepo.save(courseChapiter);

    // save lessons (variable count decided by Gemini) with optional YouTube video
    for (const lessonData of chapterData.lessons) {
      let lessonVideo: YoutubeVideo | null = null;
      if (dto.include_video) {
        lessonVideo = await this.youtubeService.searchVideo(
          lessonData.title,
          dto.title,
          dto.difficulty,
          dto.description
        );
        if (lessonVideo && seenVideoIds.has(lessonVideo.videoId)) {
          lessonVideo = null;
        }
        if (lessonVideo) {
          seenVideoIds.add(lessonVideo.videoId);
        }
      }

      const lesson = this.lessonRepo.create({
        title: lessonData.title,
        content: lessonData.content,
        video_id: lessonVideo?.videoId ?? null,
        video_title: lessonVideo?.title ?? null,
        video_thumbnail: lessonVideo?.thumbnail ?? null,
        video_url: lessonVideo?.url ?? null,
      } as Partial<Lesson>);
      lesson.chapiter = savedChapiter;
      await this.lessonRepo.save(lesson);
    }
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
      lessons: (cc.chapiter.lessons || []).map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        content: lesson.content,
        video: lesson.video_id ? {
          videoId: lesson.video_id,
          title: lesson.video_title,
          thumbnail: lesson.video_thumbnail,
          url: lesson.video_url,
        } : null,
      })),
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
          chapiter: {
            lessons: true,
          },
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
