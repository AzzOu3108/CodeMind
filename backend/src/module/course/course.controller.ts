import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { GetUserId } from 'src/common/pipes/decorators/get-user-id.decorator';
import { AiService } from 'src/ai/ai.service';
import { YoutubeService } from 'src/youtube/youtube.service';

@UseGuards(JwtAuthGuard)
@Controller('course')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly aiService: AiService,
    private readonly youtubeService: YoutubeService,
  ) {}

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post()
  create(
    @GetUserId() userId: number,
    @Body() createCourseDto: CreateCourseDto,
  ) {
    return this.courseService.create(createCourseDto, userId);
  }

  @Get()
  findAll(@GetUserId() userId: number) {
    return this.courseService.findAll(userId);
  }

  @Get('test-models')
  testAi() {
    return this.aiService.generateChapterTitles('Python', 3, 'beginner');
  }

  @Get('test-youtube')
  testYoutube() {
    return this.youtubeService.searchVideo(
      'introduction',
      'Design patterns',
      'advance',
    );
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUserId() userId: number,
  ) {
    return this.courseService.findOne(id, userId);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUserId() userId: number,
  ) {
    return this.courseService.remove(id, userId);
  }
}
