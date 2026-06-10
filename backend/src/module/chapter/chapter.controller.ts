import { Controller, Post, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { ChapterService } from './chapter.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { GetUserId } from 'src/common/pipes/decorators/get-user-id.decorator';

@ApiTags('Chapters')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@Controller('chapiter')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @Post(':courseId')
  @ApiOperation({ summary: 'Create chapters for a course' })
  @ApiResponse({ status: 201, description: 'Chapters created successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  create(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Body() createChapterDtos: CreateChapterDto[],
    @GetUserId() userId: number,
  ) {
    return this.chapterService.create(courseId, createChapterDtos, userId);
  }
}
