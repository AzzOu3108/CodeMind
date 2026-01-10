import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/module/user/user.service';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh.entity';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class AuthService {
 constructor(
    private userService: UserService,
    private jwtService : JwtService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepo : Repository<RefreshToken>
 ){}

 async login (userId: number){
   const user = await this.userService.findRawById(userId)

   if (!user) {
     throw new NotFoundException('User not found');
   }
   
   const accessToken = this.jwtService.sign(
      { sub: userId, email: user.email ?? '' },
      { secret: process.env.JWT_SECRET ?? 'default_jwt_secret', expiresIn: '15m' }
   );
   
   const refreshToken = this.jwtService.sign(
      { sub: userId } as any,
      { secret: process.env.JWT_REFRESH_SECRET ?? 'default_refresh_secret', expiresIn: '7d' }
   );

   const hashedToken = await bcrypt.hash(refreshToken, 10);

   const newRefresh = this.refreshTokenRepo.create({
     user,
     token_hash: hashedToken,
     expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
   });

   await this.refreshTokenRepo.save(newRefresh);

   return { accessToken, refreshToken };
 }

 async validateUser(email: string, password: string) {
   const user = await this.userService.findByEmail(email);

   if (!user) {
     throw new NotFoundException('User not found');
   }

   const isValid = await bcrypt.compare(password, (user as any).password);

   if (!isValid) {
     throw new UnauthorizedException('Invalid credentials');
   }

   const { password: _pwd, ...userWithoutPassword } = user as any;
   return userWithoutPassword;
 }

 async refresh(userId: number, token: string){
   const savedToken = await this.refreshTokenRepo.findOne({
      where: { user: {id:userId} },
   });

   if (!savedToken) throw new ForbiddenException('No refresh token found');
   
   const isValid = await bcrypt.compare(token, savedToken.token_hash);

   if (!isValid) throw new ForbiddenException('Invalid refresh token found');
   
   return this.login(userId);
 }

 async logout(userId: number){
   await this.refreshTokenRepo.delete({user: {id:userId}})
 }
}
