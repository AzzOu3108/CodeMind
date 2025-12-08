import { IsNotEmpty, IsString, MaxLength, IsInt } from 'class-validator';

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
}