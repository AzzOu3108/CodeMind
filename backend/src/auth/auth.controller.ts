import { Controller, Post, Body, Req, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshToken } from './entities/refresh.entity';
import { JwtRefreshGuard } from './guards/jwt.refresh.guard';
import { JwtAuthGuard } from './guards/jwt.auth.guard';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() dto:LoginDto,
    @Res({passthrough: true}) res:any
  ) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    const {accessToken, refreshToken} = await this.authService.login(user.id);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return {accessToken}
  }

  
  @Post('refresh')
  async refresh(@Req() req) {
  const refreshToken = req.cookies?.refresh_token;
  const { accessToken } = await this.authService.refresh(refreshToken);
  return { accessToken };
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Req() req, 
  @Res({passthrough: true}) res: any
  ){
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return this.authService.logout(req.user.userId)
  }
}
