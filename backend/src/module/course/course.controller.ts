import { Controller, Get, Post, Body, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { GetUserId } from 'src/common/pipes/decorators/get-user-id.decorator';
import { GeminiService } from 'src/gemini/gemini.service';
import { YoutubeService } from 'src/youtube/youtube.service';


@UseGuards(JwtAuthGuard)
@Controller('course')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly geminiService: GeminiService,
    private readonly youtubeService: YoutubeService
  ) {}

  @Post()
  create(@GetUserId() userId: number , @Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto, userId);
  }

  @Get()
  findAll() {
    return this.courseService.findAll();
  }

  @Get('test-models')
  testGemini() {
    return this.geminiService.generateChapterTitles('Python', 3, 'beginner');
  }

  @Get('test-youtube')
  testYoutube() {
    return this.youtubeService.searchVideo('introduction', 'Design patterns', 'advance');
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.remove(id);
  }
}
