import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  private publishedPostsCache: Post[] | null = null;
  private cacheExpiry: number = 0;
  private readonly CACHE_TTL = 60000; // 1 minute cache

  constructor(@InjectRepository(Post) private readonly postRepository: Repository<Post>) {}

  async findPublished(): Promise<Post[]> {
    // Return cached data if available and not expired
    const now = Date.now();
    if (this.publishedPostsCache && now < this.cacheExpiry) {
      return this.publishedPostsCache;
    }

    // Optimized query using query builder for better performance
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .where('post.publishedAt IS NOT NULL')
      .orderBy('post.createdAt', 'DESC')
      .cache(true) // Enable TypeORM query result cache
      .getMany();

    // Update cache
    this.publishedPostsCache = posts;
    this.cacheExpiry = now + this.CACHE_TTL;

    return posts;
  }

  async findBySlug(slug: string): Promise<Post> {
    // Use query builder with cache for better performance
    const post = await this.postRepository
      .createQueryBuilder('post')
      .where('post.slug = :slug', { slug })
      .cache(true)
      .getOne();
      
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async findAll(): Promise<Post[]> {
    return this.postRepository
      .createQueryBuilder('post')
      .orderBy('post.createdAt', 'DESC')
      .getMany();
  }

  async createOne(input: CreatePostDto): Promise<Post> {
    const entity: Post = this.postRepository.create({
      title: input.title,
      slug: input.slug,
      content: input.content,
      summary: input.summary ?? null,
      publishedAt: input.publishedAt ? new Date(input.publishedAt) : new Date()
    });
    const saved = await this.postRepository.save(entity);
    
    // Invalidate cache
    this.invalidateCache();
    
    return saved;
  }

  async updateOne(id: string, input: UpdatePostDto): Promise<Post> {
    const existing = await this.postRepository.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Post not found');
    }
    existing.title = input.title ?? existing.title;
    existing.slug = input.slug ?? existing.slug;
    existing.content = input.content ?? existing.content;
    existing.summary = input.summary ?? existing.summary;
    existing.publishedAt = input.publishedAt ? new Date(input.publishedAt) : existing.publishedAt;
    
    const saved = await this.postRepository.save(existing);
    
    // Invalidate cache
    this.invalidateCache();
    
    return saved;
  }

  async deleteOne(id: string): Promise<{ deleted: boolean }> {
    const existing = await this.postRepository.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Post not found');
    }
    await this.postRepository.delete(id);
    
    // Invalidate cache
    this.invalidateCache();
    
    return { deleted: true } as const;
  }

  private invalidateCache(): void {
    this.publishedPostsCache = null;
    this.cacheExpiry = 0;
  }
}


