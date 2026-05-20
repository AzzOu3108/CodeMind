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
import { CourseChapiter } from '../course_chapter/entities/course_chapiter.entity';
import { Lesson } from 'src/module/lesson/entities/lesson.entity';
import { GeminiService } from 'src/gemini/gemini.service';
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
    @InjectRepository(CourseChapiter)
    private courseChapiterRepo: Repository<CourseChapiter>,
    @InjectRepository(Lesson)
    private lessonRepo: Repository<Lesson>,

    private geminiService: GeminiService,
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
        c.chapiter_count === dto.chapiter_count,
    );

    if (cached) {
      return this.findOne(cached.id);
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

      const content = await this.geminiService.generateChapterDescription(
        dto.title,
        chapterTitle,
        dto.difficulty,
      );

      const chapiter = this.chapiterRepo.create({
        title: chapterTitle,
        content,
      });
      const savedChapiter = await this.chapiterRepo.save(chapiter);

      // save join table row (no chapter-level video anymore)
      const courseChapiter = this.courseChapiterRepo.create({
        course_id: savedCourse.id,
        chapiter_id: savedChapiter.id,
        order: i + 1,
      } as Partial<CourseChapiter>);
      await this.courseChapiterRepo.save(courseChapiter);

      // generate and save lessons
      const generatedLessons = await this.geminiService.generateLessons(
        dto.title,
        chapterTitle,
        dto.difficulty,
        3,
      );

      for (let j = 0; j < generatedLessons.length; j++) {
        const gl = generatedLessons[j];

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
          );
        }

        const lesson = this.lessonRepo.create({
          title: gl.title,
          content: gl.content,
          order: j + 1,
          duration_minutes: gl.duration_minutes,
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
    const chapters = course.courseChapiter.map((cc) => {
      const lessons = (cc.chapiter.lessons || [])
        .sort((a, b) => a.order - b.order)
        .map((lesson) => ({
          id: lesson.id,
          order: lesson.order,
          title: lesson.title,
          content: lesson.content,
          duration_minutes: lesson.duration_minutes,
          video: lesson.video_id
            ? {
                videoId: lesson.video_id,
                title: lesson.video_title,
                thumbnail: lesson.video_thumbnail,
                url: lesson.video_url,
              }
            : null,
        }));

      const total_duration = lessons.reduce(
        (sum, l) => sum + (l.duration_minutes || 0),
        0,
      );

      return {
        id: cc.chapiter.id,
        order: cc.order,
        title: cc.chapiter.title,
        description: cc.chapiter.content,
        lessons_count: lessons.length,
        total_duration,
        lessons,
      };
    });

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      difficulty: course.difficulty,
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
        courseChapiter: {
          chapiter: {
            lessons: true,
          },
        },
      },
    });
    return courses.map((c) => this.formatCourseResponse(c));
  }

  async findOne(id: number) {
    const course = await this.courseRepo.findOne({
      where: { id },
      relations: {
        courseChapiter: {
          chapiter: {
            lessons: true,
          },
        },
      },
      order: {
        courseChapiter: {
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
      relations: { courseChapiter: { chapiter: true } },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.courseChapiter && course.courseChapiter.length > 0) {
      const chapiterIds = course.courseChapiter.map((cc) => cc.chapiter.id);
      await this.chapiterRepo.delete(chapiterIds);
    }

    await this.courseRepo.remove(course);
  }
}
