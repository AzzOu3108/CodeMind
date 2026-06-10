import { IsEnum, IsNotEmpty, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ResourcesType {
  Video = 'video',
  // you can add other types later
}

export class CreateResourceDto {
  @ApiProperty({ enum: ResourcesType, example: ResourcesType.Video, description: 'Resource type' })
  @IsNotEmpty()
  @IsEnum(ResourcesType)
  type: ResourcesType;

  @ApiProperty({ example: 'https://www.youtube.com/watch?v=...', description: 'Resource URL' })
  @IsNotEmpty()
  @IsUrl()
  url: string;
}
