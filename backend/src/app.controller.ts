import { Controller, Get, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({ status: 200, description: 'Returns "Hello World!"' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('cookies')
  @ApiOperation({ summary: 'Debug: read current cookies (dev only)' })
  @ApiResponse({ status: 200, description: 'Returns parsed cookie names' })
  getCookies(@Req() request) {
    return {
      cookies: Object.keys(request.cookies || {}),
      has_access_token: !!request.cookies?.access_token,
      has_refresh_token: !!request.cookies?.refresh_token,
    };
  }
}
