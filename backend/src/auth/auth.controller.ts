import { Controller, Post, Body, Req, UseGuards, Res, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
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
    
    res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return {message: 'Login successful', accessToken, refreshToken}
  }

  
  @Post('refresh')
  async refresh(@Req() req, @Res({ passthrough: true }) res: any) {
  const refreshToken = req.cookies?.refresh_token;
  const { accessToken, refreshToken: newRefreshToken } = await this.authService.refresh(refreshToken);

  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.cookie('refresh_token', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

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

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req){
     return {
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar || null,
    };
  }
}
