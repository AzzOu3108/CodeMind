import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ){}

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: {email: dto.email}
    })
    if(!user){
      throw new UnauthorizedException('Invalid credentials')
    }

    const isMatch = await bcrypt.compare(dto.password, user.password)
    if(!isMatch){
      throw new UnauthorizedException('Invalid credentials')
    }

    const payload = {sub: user.id}
    return {
      access_token: this.jwtService.sign(payload)
    }
  }
}
