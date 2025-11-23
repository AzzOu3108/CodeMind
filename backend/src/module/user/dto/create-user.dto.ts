import { IsEmail, IsNotEmpty, MaxLength, MinLength} from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MaxLength(20)
    @MinLength(6)
    password: string;
}
