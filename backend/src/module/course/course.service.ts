import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { User } from 'src/module/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Chapiter } from 'src/module/chapter/entities/chapter.entity';
import { Lesson } from 'src/module/lesson/entities/lesson.entity';
import { AiService } from 'src/ai/ai.service';
import { YoutubeService } from 'src/youtube/youtube.service';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Chapiter)
    private chapiterRepo: Repository<Chapiter>,
    @InjectRepository(Lesson)
    private lessonRepo: Repository<Lesson>,

    private aiService: AiService,
    private youtubeService: YoutubeService,
  ) {}

  async create(dto: CreateCourseDto, userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const existingCourse = await this.courseRepo.find({
      where: {
        user: { id: userId },
        title: dto.title.trim(),
      },
    });

    const levelOrder = {
      beginner: 1,
      intermediate: 2,
      advanced: 3,
    };

    const newlevel = levelOrder[dto.difficulty];

    const invalid = existingCourse.some(
      (c) => levelOrder[c.difficulty] >= newlevel,
    );

    if (invalid) {
      throw new BadRequestException(
        'You already have this course at the same or higher level. Please choose a higher difficulty.',
      );
    }

    const cached = existingCourse.find(
      (c) =>
        c.difficulty === dto.difficulty &&
        c.chapiter_count === dto.chapiter_count &&
        c.tech_stack === dto.tech_stack,
    );

    if (cached) {
      return this.findOne(cached.id);
    }

    const chapiterTitles = await this.aiService.generateChapterTitles(
      dto.title,
      dto.chapiter_count,
      dto.difficulty,
      dto.description,
      dto.tech_stack,
    );

    const course = this.courseRepo.create({
      title: dto.title.trim(),
      description: dto.description?.trim() ?? '',
      chapiter_count: dto.chapiter_count,
      include_video: dto.include_video,
      difficulty: dto.difficulty,
      tech_stack: dto.tech_stack,
      progress: 0,
      user,
    });
    const savedCourse = await this.courseRepo.save(course);

    const allLessonTitles: string[] = [];
    const allVideoIds: string[] = [];

    for (let i = 0; i < chapiterTitles.length; i++) {
      const chapterTitle = chapiterTitles[i];

      const content = await this.aiService.generateChapterDescription(
        dto.title,
        chapterTitle,
        dto.difficulty,
        dto.tech_stack,
      );

      const chapiter = this.chapiterRepo.create({
        title: chapterTitle,
        content,
        order: i + 1,
        course: savedCourse,
      });
      const savedChapiter = await this.chapiterRepo.save(chapiter);

      const generatedLessons = await this.aiService.generateLessons(
        dto.title,
        chapterTitle,
        dto.difficulty,
        3,
        allLessonTitles,
        dto.tech_stack,
      );

      for (let j = 0; j < generatedLessons.length; j++) {
        const gl = generatedLessons[j];
        allLessonTitles.push(gl.title);

        let lessonVideoData: {
          videoId: string;
          title: string;
          thumbnail: string;
          url: string;
        } | null = null;
        if (dto.include_video) {
          lessonVideoData = await this.youtubeService.searchVideo(
            gl.title,
            dto.title,
            dto.difficulty,
            chapterTitle,
            allVideoIds,
          );
        }
        if (lessonVideoData) {
          allVideoIds.push(lessonVideoData.videoId);
        }

        const lesson = this.lessonRepo.create({
          title: gl.title,
          content: gl.content,
          order: j + 1,
          video_id: lessonVideoData?.videoId ?? null,
          video_title: lessonVideoData?.title ?? null,
          video_thumbnail: lessonVideoData?.thumbnail ?? null,
          video_url: lessonVideoData?.url ?? null,
          chapiter: savedChapiter,
        } as Partial<Lesson>);
        await this.lessonRepo.save(lesson);
      }
    }

    // return full formatted response
    const fullCourse = await this.findOne(savedCourse.id);
    return fullCourse;
  }

  private formatCourseResponse(course: Course) {
    const chapters = (course.chapiters || [])
      .sort((a, b) => a.order - b.order)
      .map((chapiter) => {
        const lessons = (chapiter.lessons || [])
          .sort((a, b) => a.order - b.order)
          .map((lesson) => ({
            id: lesson.id,
            order: lesson.order,
            title: lesson.title,
            content: lesson.content,
            video: lesson.video_id
              ? {
                  videoId: lesson.video_id,
                  title: lesson.video_title,
                  thumbnail: lesson.video_thumbnail,
                  url: lesson.video_url,
                }
              : null,
          }));

        return {
          id: chapiter.id,
          order: chapiter.order,
          title: chapiter.title,
          description: chapiter.content,
          lessons_count: lessons.length,
          lessons,
        };
      });

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      difficulty: course.difficulty,
      tech_stack: course.tech_stack,
      chapiter_count: course.chapiter_count,
      include_video: course.include_video,
      created_at: course.created_at,
      chapters,
    };
  }

  async findAll() {
    const courses = await this.courseRepo.find({
      order: { created_at: 'DESC' },
      relations: {
        chapiters: {
          lessons: true,
        },
      },
    });
    return courses.map((c) => this.formatCourseResponse(c));
  }

  async findOne(id: number) {
    const course = await this.courseRepo.findOne({
      where: { id },
      relations: {
        chapiters: {
          lessons: true,
        },
      },
      order: {
        chapiters: {
          order: 'ASC',
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return this.formatCourseResponse(course);
  }

  async remove(courseId: number): Promise<void> {
    const course = await this.courseRepo.findOne({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    await this.courseRepo.remove(course);
  }
}
