import { IsDate, IsInt, IsNotEmpty, IsString } from "class-validator";

export class RefreshDto {

    @IsInt()
    @IsNotEmpty()
    user_id: number;

    @IsString()
    @IsNotEmpty()
    token_hash: string;

    @IsDate()
    @IsNotEmpty()
    expires_at: Date;
}