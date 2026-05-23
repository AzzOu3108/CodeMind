import { IsEnum, IsInt, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export enum ResourcesType {
  Video = 'video',
  // you can add other types later
}

export class CreateResourceDto {
  @IsNotEmpty()
  @IsEnum(ResourcesType)
  type: ResourcesType;

  @IsNotEmpty()
  @IsUrl()
  url: string;
}
