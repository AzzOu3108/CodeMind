import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chapiter } from './entities/chapter.entity';
import { Repository } from 'typeorm';
import { CourseChapiter } from '../course_chapter/entities/course_chapiter.entity';
import { CourseService } from '../course/course.service';
import { title } from 'process';

@Injectable()
export class ChapterService {
  constructor(
    @InjectRepository(Chapiter)
    private readonly chapiterRepo: Repository<Chapiter>,

    @InjectRepository(CourseChapiter)
    private readonly courseChapiterRepo: Repository<CourseChapiter>,

    private readonly courseService: CourseService,
  ) {}

  async create(
    courseId: number,
    chapiter: CreateChapterDto[],
  ): Promise<Chapiter[]> {
    const course = await this.courseService.findOne(courseId);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const existingLinks = await this.courseChapiterRepo.find({
      where: { course: { id: courseId } },
      relations: { chapiter: true },
    });

    const existingTitles = new Set(
      existingLinks.map((link) => link.chapiter.title.toLowerCase()),
    );

    const duplicated = chapiter.filter((dto) =>
      existingTitles.has(dto.title.toLocaleLowerCase()),
    );

    if (duplicated.length > 0) {
      throw new ConflictException(
        `Chapiter already exists: ${duplicated.map((d) => d.title).join(', ')}`,
      );
    }

    const lastLink = await this.courseChapiterRepo.findOne({
      where: { course: { id: courseId } },
      order: { order: 'DESC' },
    });

    const startOver = lastLink ? lastLink.order + 1 : 1;

    const chapiterEntity = chapiter.map((dto) =>
      this.chapiterRepo.create({
        title: dto.title,
        content: dto.content,
      }),
    );

    const savedChapiter = await this.chapiterRepo.save(chapiterEntity);

    const links = savedChapiter.map((chapiter, index) =>
      this.courseChapiterRepo.create({
        course,
        chapiter,
        order: startOver + index,
      }),
    );

    await this.courseChapiterRepo.save(links);
    return savedChapiter;
  }

  async findAll() {
    return this.chapiterRepo.find({
      order: { created_at: 'ASC' },
    });
  }
}
