import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { SeedPostsService } from '../posts/seed-posts.service';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly seedPostsService: SeedPostsService
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    // Seed admin user
    const adminEmail: string = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword: string = process.env.ADMIN_PASSWORD || 'admin123';
    const existing: User | null = await this.userRepository.findOne({ where: { email: adminEmail } });
    if (!existing) {
      const passwordHash: string = await bcrypt.hash(adminPassword, 10);
      const user: User = this.userRepository.create({ email: adminEmail, passwordHash, role: 'admin' });
      await this.userRepository.save(user);
      this.logger.log(`Seeded admin user: ${adminEmail} (password: ${adminPassword})`);
    }

    // Seed sample posts
    await this.seedPostsService.seedSamplePosts();
  }
}


