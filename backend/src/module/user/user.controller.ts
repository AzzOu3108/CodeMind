import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TrimPipe } from 'src/common/pipes/trim/trim.pipe';
import { UserExistsPipe } from 'src/common/pipes/user-exists/user-exists.pipe';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body(new TrimPipe()) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe, UserExistsPipe) id: number) {
    return this.userService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  update(
    @CurrentUser() user: JwtPayload,
    @Body(new TrimPipe()) updateUserDto: UpdateUserDto) {
    return this.userService.update(user.id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe, UserExistsPipe) id: number) {
    return this.userService.remove(id);
  }
}
