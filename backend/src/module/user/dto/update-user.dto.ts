import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsOptional, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
    fullname?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @MaxLength(12)
    @MinLength(6)
    password?: string;
}
