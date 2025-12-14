import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Progress } from './entities/progress.entity';
import { Chapiter } from '../chapter/entities/chapiter.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Progress, Chapiter, User])],
  exports: [TypeOrmModule]
})
export class ProgressModule {}
