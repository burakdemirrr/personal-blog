import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from './posts.service';
import { Post } from './post.entity';

describe('PostsService', () => {
  it('should create and fetch a post', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({ type: 'sqlite', database: ':memory:', dropSchema: true, entities: [Post], synchronize: true }),
        TypeOrmModule.forFeature([Post])
      ],
      providers: [PostsService]
    }).compile();

    const service = moduleRef.get(PostsService);
    const created = await service.createOne({ title: 't', slug: 't', content: 'c' });
    const list = await service.findAll();
    expect(created.id).toBeDefined();
    expect(list.length).toBe(1);
  });
});


