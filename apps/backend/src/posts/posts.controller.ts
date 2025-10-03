import { Body, Controller, Delete, Get, Header, Param, Patch, Post as HttpPost, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('posts')
  @Header('Cache-Control', 'public, max-age=60, s-maxage=60, stale-while-revalidate=120')
  @Header('X-Content-Type-Options', 'nosniff')
  findPublished() {
    return this.postsService.findPublished();
  }

  @Get('posts/:slug')
  @Header('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=600')
  @Header('X-Content-Type-Options', 'nosniff')
  findBySlug(@Param('slug') slug: string) {
    return this.postsService.findBySlug(slug);
  }

  @Get('admin/posts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAll() {
    return this.postsService.findAll();
  }

  @HttpPost('admin/posts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  createOne(@Body() body: CreatePostDto) {
    return this.postsService.createOne(body);
  }

  @Patch('admin/posts/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateOne(@Param('id') id: string, @Body() body: UpdatePostDto) {
    return this.postsService.updateOne(id, body);
  }

  @Delete('admin/posts/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  deleteOne(@Param('id') id: string) {
    return this.postsService.deleteOne(id);
  }
}


