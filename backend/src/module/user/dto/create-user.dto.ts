import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  @IsNotEmpty()
  @IsString()
  fullname: string;

  @ApiProperty({ example: 'john@example.com', description: 'User email address' })
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password (6-20 characters)' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @MinLength(6)
  password: string;
}
