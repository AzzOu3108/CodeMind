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

import { TECH_STACKS } from '../tech-stacks';

export enum Difficulty {
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Advanced = 'advanced',
}

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  description: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(20)
  chapiter_count: number;

  @IsBoolean()
  include_video: boolean;

  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @IsString()
  @IsNotEmpty()
  @IsIn(TECH_STACKS.map(s => s.value))
  tech_stack: string;
}
