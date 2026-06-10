import { IsDate, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshDto {
  @ApiProperty({ description: 'User ID' })
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty({ description: 'Bcrypt hash of the refresh token' })
  @IsString()
  @IsNotEmpty()
  token_hash: string;

  @ApiProperty({ description: 'Token expiration timestamp' })
  @IsDate()
  @IsNotEmpty()
  expires_at: Date;
}
