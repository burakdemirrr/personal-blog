import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { SeedPostsService } from './seed-posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  providers: [PostsService, SeedPostsService],
  controllers: [PostsController],
  exports: [SeedPostsService]
})
export class PostsModule {}


