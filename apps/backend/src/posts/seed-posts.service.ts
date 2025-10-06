import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';

@Injectable()
export class SeedPostsService {
  private readonly logger = new Logger(SeedPostsService.name);

  constructor(@InjectRepository(Post) private readonly postRepository: Repository<Post>) {}

  async seedSamplePosts(): Promise<void> {
    const count = await this.postRepository.count();
    if (count > 0) {
      this.logger.log('Posts already exist, skipping seed');
      return;
    }

    const samplePosts = [
      {
        title: 'Welcome to My Blog',
        slug: 'welcome-to-my-blog',
        content: `# Welcome!

This is my personal blog where I share my thoughts, experiences, and learnings about technology, programming, and life.

## What You'll Find Here

- **Technical Articles** - Deep dives into programming concepts
- **Tutorials** - Step-by-step guides
- **Experiences** - Lessons learned from projects
- **Thoughts** - Random musings about tech and life

Stay tuned for more content!`,
        summary: 'An introduction to my blog and what you can expect to find here.',
        publishedAt: new Date(),
      },
      {
        title: 'Getting Started with Next.js 15',
        slug: 'getting-started-with-nextjs-15',
        content: `# Getting Started with Next.js 15

Next.js 15 brings exciting new features and improvements. Here's what you need to know.

## Key Features

### 1. App Router Improvements
The App Router is now more stable and performant than ever.

### 2. Server Actions
Server actions make it easy to handle form submissions and data mutations.

### 3. Improved Performance
- Faster build times
- Optimized bundle sizes
- Better caching strategies

## Installation

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

Happy coding!`,
        summary: 'Learn about the new features in Next.js 15 and how to get started.',
        publishedAt: new Date(Date.now() - 86400000), // 1 day ago
      },
      {
        title: 'Performance Optimization Tips',
        slug: 'performance-optimization-tips',
        content: `# Performance Optimization Tips

Making your web applications fast is crucial for user experience. Here are my top tips.

## Database Optimization

1. **Use Indexes** - Index frequently queried columns
2. **Cache Results** - Implement caching layers
3. **Optimize Queries** - Use query builders efficiently

## Frontend Optimization

1. **Code Splitting** - Load only what you need
2. **Image Optimization** - Use WebP/AVIF formats
3. **Lazy Loading** - Defer non-critical resources

## Caching Strategy

Implement a multi-layer caching approach:
- Browser cache
- CDN cache
- Server cache
- Database cache

Results: **90% faster load times!**`,
        summary: 'Essential tips for optimizing web application performance.',
        publishedAt: new Date(Date.now() - 172800000), // 2 days ago
      },
      {
        title: 'Draft: Future Post Ideas',
        slug: 'draft-future-post-ideas',
        content: `# Future Post Ideas

This is a draft post with ideas for future content.

## Topics to Cover

- TypeScript best practices
- React hooks deep dive
- Building scalable APIs
- DevOps basics

This post is not published yet!`,
        summary: 'A draft post with future content ideas.',
        publishedAt: null, // Draft
      },
    ];

    for (const postData of samplePosts) {
      const post = this.postRepository.create(postData);
      await this.postRepository.save(post);
      this.logger.log(`Seeded post: ${post.title}`);
    }

    this.logger.log('Sample posts seeded successfully');
  }
}


