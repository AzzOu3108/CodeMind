import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'User full name', required: false })
  @IsOptional()
  @IsString()
  fullname?: string;

  @ApiProperty({ example: 'john@example.com', description: 'User email address', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Avatar URL or data URI', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500000)
  avatar?: string;

  @ApiProperty({ description: 'New password (6-12 characters)', required: false })
  @IsOptional()
  @MinLength(6)
  @MaxLength(12)
  password?: string;

  @ApiProperty({ description: 'Password confirmation (must match password)', required: false })
  @IsOptional()
  @IsString()
  confirmPassword?: string;
}
