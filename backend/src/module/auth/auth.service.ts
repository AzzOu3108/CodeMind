import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login-dto';

@Injectable()
export class AuthService {

  login(loginDto: LoginDto) {
    return {message: 'Login successful', token :'your jwt token here'}
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
