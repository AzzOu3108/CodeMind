import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Progress } from './entities/progress.entity';
import { UserModule } from '../user/user.module';
import { ChapiterModule } from '../chapter/chapter.module';

@Module({
  imports: [TypeOrmModule.forFeature([Progress]), UserModule, ChapiterModule],
  exports: [TypeOrmModule],
})
export class ProgressModule {}
