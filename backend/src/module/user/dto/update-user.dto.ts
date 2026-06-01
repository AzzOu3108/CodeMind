import {
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  fullname?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500000)
  avatar?: string;

  @IsOptional()
  @MinLength(6)
  @MaxLength(12)
  password?: string;

  @IsOptional()
  @IsString()
  confirmPassword?: string;
}
