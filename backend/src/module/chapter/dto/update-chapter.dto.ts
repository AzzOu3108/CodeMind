import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateChapterDto } from './create-chapter.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateChapterDto extends PartialType(CreateChapterDto) {
  @ApiProperty({ description: 'Chapter completion status', required: false })
  @IsOptional()
  @IsBoolean()
  is_completed?: boolean;
}
