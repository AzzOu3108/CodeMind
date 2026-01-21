import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('cookies')
  getCookies(@Req() request) {
    console.log(request.cookies); 
    const token = request.cookies['token'];
  }
}
