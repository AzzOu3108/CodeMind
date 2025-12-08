import { IsBoolean, IsInt, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateChapterDto {
    @IsInt()
    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    title: string

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    content: JSON

    @IsNotEmpty()
    @IsBoolean()
    is_completed: boolean
}
