import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule as Feature } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Post } from './posts/post.entity';
import { SeedService } from './users/seed.service';
import { SeedPostsService } from './posts/seed-posts.service';
import { UploadsController } from './uploads/uploads.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DB_PATH || 'app.db',
      autoLoadEntities: true,
      synchronize: true,
      cache: {
        type: 'database',
        duration: 60000, // 1 minute cache
      },
      // SQLite optimizations
      extra: {
        // Enable WAL mode for better concurrent access
        pragma: [
          'journal_mode = WAL',
          'synchronous = NORMAL',
          'cache_size = -10000', // 10MB cache
          'temp_store = MEMORY',
        ],
      },
    }),
    Feature.forFeature([User, Post]),
    AuthModule,
    PostsModule
  ],
  controllers: [AppController, UploadsController],
  providers: [AppService, SeedService, SeedPostsService]
})
export class AppModule {}
