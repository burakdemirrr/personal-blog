import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';

describe('AuthService', () => {
  it('should login with correct credentials and return token', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({ type: 'sqlite', database: ':memory:', dropSchema: true, entities: [User], synchronize: true }),
        TypeOrmModule.forFeature([User]),
        JwtModule.register({ secret: 'test_secret', signOptions: { expiresIn: '1h' } })
      ],
      providers: [AuthService]
    }).compile();

    const service = moduleRef.get(AuthService);
    const repo = moduleRef.get('UserRepository');
    const hash = await bcrypt.hash('pass1234', 10);
    await repo.save(repo.create({ email: 'u@test.com', passwordHash: hash, role: 'admin' }));

    const res = await service.executeLogin('u@test.com', 'pass1234');
    expect(res.accessToken).toBeDefined();
  });
});


