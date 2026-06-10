import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsInt,
  IsBoolean,
  IsEnum,
  IsIn,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { TECH_STACKS } from '../tech-stacks';

export enum Difficulty {
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Advanced = 'advanced',
}

export class CreateCourseDto {
  @ApiProperty({ example: 'Introduction to Python', description: 'Course title' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({ example: 'Learn Python from scratch', description: 'Course description' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  description: string;

  @ApiProperty({ example: 5, description: 'Number of chapters (1-20)', minimum: 1, maximum: 20 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(20)
  chapiter_count: number;

  @ApiProperty({ example: true, description: 'Whether to include YouTube video recommendations' })
  @IsBoolean()
  include_video: boolean;

  @ApiProperty({ enum: Difficulty, example: Difficulty.Beginner, description: 'Course difficulty level' })
  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @ApiProperty({
    example: 'NestJS',
    description: 'Technology stack for the course',
    enum: TECH_STACKS.map(s => s.value),
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(TECH_STACKS.map(s => s.value))
  tech_stack: string;
}
