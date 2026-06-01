import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chapiter } from './entities/chapter.entity';
import { Repository } from 'typeorm';
import { CourseService } from '../course/course.service';
import { Course } from '../course/entities/course.entity';

@Injectable()
export class ChapterService {
  constructor(
    @InjectRepository(Chapiter)
    private readonly chapiterRepo: Repository<Chapiter>,

    private readonly courseService: CourseService,
  ) {}

  async create(
    courseId: number,
    chapiter: CreateChapterDto[],
    userId: number,
  ): Promise<Chapiter[]> {
    const course = await this.courseService.findOne(courseId, userId);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const existingChapiters = await this.chapiterRepo.find({
      where: { course: { id: courseId } },
    });

    const existingTitles = new Set(
      existingChapiters.map((ch) => ch.title.toLowerCase()),
    );

    const duplicated = chapiter.filter((dto) =>
      existingTitles.has(dto.title.toLocaleLowerCase()),
    );

    if (duplicated.length > 0) {
      throw new ConflictException(
        `Chapiter already exists: ${duplicated.map((d) => d.title).join(', ')}`,
      );
    }

    const lastChapiter = existingChapiters.sort((a, b) => b.order - a.order)[0];
    const startOrder = lastChapiter ? lastChapiter.order + 1 : 1;

    const chapiterEntities = chapiter.map((dto, index) =>
      this.chapiterRepo.create({
        title: dto.title,
        content: dto.content,
        order: startOrder + index,
        course: { id: courseId } as Course,
      }),
    );

    const savedChapiters = await this.chapiterRepo.save(chapiterEntities);
    return savedChapiters;
  }

  async findAll() {
    return this.chapiterRepo.find({
      order: { created_at: 'ASC' },
    });
  }
}
