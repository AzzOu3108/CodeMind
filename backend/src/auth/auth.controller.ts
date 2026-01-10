import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshToken } from './entities/refresh.entity';
import { JwtRefreshGuard } from './guards/jwt.refresh.guard';
import { JwtAuthGuard } from './guards/jwt.auth.guard';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto:LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    return this.authService.login(user.id);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(
    @Req() req,
    @Body('refreshToken') refreshToken:string
  ){
    return this.authService.refresh(req.user.userId, refreshToken)
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Req() req){
    return this.authService.logout(req.user.userId)
  }
}
