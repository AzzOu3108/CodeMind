import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {expiresIn: '7d'}
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, jwtStrategy, JwtAuthGuard],
  exports:[JwtModule, JwtAuthGuard]
})
export class AuthModule {}
