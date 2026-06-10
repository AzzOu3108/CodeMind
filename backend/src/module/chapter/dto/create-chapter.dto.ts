import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChapterDto {
  @ApiProperty({ example: 'Getting Started', description: 'Chapter title' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({ example: 'Introduction to the basics...', description: 'Chapter content/description' })
  @IsNotEmpty()
  @IsString()
  content: string;
}
