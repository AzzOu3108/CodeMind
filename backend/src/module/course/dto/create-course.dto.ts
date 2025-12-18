import { IsNotEmpty, IsString, MaxLength, IsInt, IsBoolean, IsEnum } from 'class-validator';

export enum Difficulty {
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Advanced = 'advanced',
}

export class CreateCourseDto {
  @IsInt()
  @IsNotEmpty()
  user_id: number;
  
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
  chapiter_count: number;

  @IsBoolean()
  include_video: boolean;

  @IsEnum(Difficulty)
  difficulty: Difficulty;

}