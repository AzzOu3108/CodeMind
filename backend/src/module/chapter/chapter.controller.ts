import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { ChapterService } from './chapter.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';


@UseGuards(JwtAuthGuard)
@Controller('chapiter')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @Post(':courseId')
  create(
    @Param('courseId') courseId: number,
    @Body() createChapterDtos: CreateChapterDto[]
  ) {
    return this.chapterService.create(courseId ,createChapterDtos);
  }

  @Get()
  findAll() {
    return this.chapterService.findAll();
  }

}
