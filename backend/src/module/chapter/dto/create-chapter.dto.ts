import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateChapterDto {

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    title: string

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    content: string
}
