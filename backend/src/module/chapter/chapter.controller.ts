import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { ChapterService } from './chapter.service';


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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chapterService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chapterService.remove(+id);
  }
}
