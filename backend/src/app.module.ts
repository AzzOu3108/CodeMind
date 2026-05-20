import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './module/user/user.module';
import databaseConfig from './config/database.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseModule } from './module/course/course.module';
import { CourseChapiterModule } from './module/course_chapter/course_chapiter.module';
import { ProgressModule } from './module/progress/progress.module';
import { ChapiterModule } from './module/chapter/chapter.module';
import { ResourcesModule } from './module/resources/resources.module';
import { AuthModule } from './auth/auth.module';
import { GeminiModule } from './gemini/gemini.module';
import { YoutubeModule } from './youtube/youtube.module';
import { LessonModule } from './module/lesson/lesson.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const db = configService.get('database');

        return {
          type: 'postgres',
          host: db.host,
          port: db.port,
          username: db.username,
          password: db.password,
          database: db.name,
          autoLoadEntities: true,
          synchronize: db.synchronize,
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    CourseModule,
    ChapiterModule,
    CourseChapiterModule,
    ProgressModule,
    ResourcesModule,
    AuthModule,
    GeminiModule,
    YoutubeModule,
    LessonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
