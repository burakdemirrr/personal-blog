import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as express from 'express';
const compression = require('compression');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { 
    cors: true,
    logger: ['error', 'warn'], // Reduce logging overhead in production
  });
  
  app.enableCors({ 
    origin: [/localhost:\d+$/], 
    credentials: true,
    maxAge: 86400, // Cache preflight requests for 24 hours
  });
  
  // Enable compression for all responses
  app.use(compression({
    filter: (req: express.Request, res: express.Response) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    },
    threshold: 1024, // Only compress responses > 1KB
    level: 6, // Balanced compression level (0-9)
  }));
  
  app.useGlobalPipes(
    new ValidationPipe({ 
      whitelist: true, 
      transform: true, 
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true, // Better performance
      },
    })
  );
  
  const uploadsPath = join(process.cwd(), 'uploads');
  app.use('/uploads', express.static(uploadsPath, {
    maxAge: '1d', // Cache static files for 1 day
    etag: true,
    lastModified: true,
  }));
  
  const port: number = process.env.PORT ? Number(process.env.PORT) : 4000;
  await app.listen(port);
  console.log(`🚀 Backend is running on http://localhost:${port}`);
  console.log(`📁 Uploads directory: ${uploadsPath}`);
}
bootstrap();
