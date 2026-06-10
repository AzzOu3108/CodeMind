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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { GetUserId } from 'src/common/pipes/decorators/get-user-id.decorator';

@ApiTags('Courses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@Controller('course')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
  ) {}

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post()
  @ApiOperation({ summary: 'Create a new course with AI-generated content' })
  @ApiResponse({ status: 201, description: 'Course created with chapters, lessons, and optional videos' })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded (3 per minute)' })
  create(
    @GetUserId() userId: number,
    @Body() createCourseDto: CreateCourseDto,
  ) {
    return this.courseService.create(createCourseDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'List all courses for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Returns user courses' })
  findAll(@GetUserId() userId: number) {
    return this.courseService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single course with chapters and lessons' })
  @ApiResponse({ status: 200, description: 'Returns the course with nested content' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUserId() userId: number,
  ) {
    return this.courseService.findOne(id, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a course' })
  @ApiResponse({ status: 200, description: 'Course deleted successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUserId() userId: number,
  ) {
    return this.courseService.remove(id, userId);
  }
}
