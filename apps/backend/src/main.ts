import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import * as express from 'express';
import compression from 'compression';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  const app = await NestFactory.create(AppModule, { 
    cors: true,
    logger: process.env.NODE_ENV === 'production' 
      ? ['error', 'warn'] 
      : ['log', 'error', 'warn', 'debug'], // More verbose in development
    bufferLogs: true, // Buffer logs until logger is ready
  });
  
  // Get ConfigService instance
  const configService = app.get(ConfigService);
  
  // Enable CORS with environment-based configuration
  app.enableCors({ 
    origin: configService.get<string>('NODE_ENV') === 'production'
      ? configService.get<string>('FRONTEND_URL', 'https://yourdomain.com')
      : [
          /localhost:\d+$/, 
          /127\.0\.0\.1:\d+$/,
          /192\.168\.\d+\.\d+:\d+$/
        ],
    credentials: true,
    maxAge: 86400, // Cache preflight requests for 24 hours
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
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
  
  // Global validation pipe with strict settings
  app.useGlobalPipes(
    new ValidationPipe({ 
      whitelist: true, 
      transform: true, 
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true, // Better performance
      },
      disableErrorMessages: configService.get<string>('NODE_ENV') === 'production',
    })
  );
  
  // Serve static uploads directory
  const uploadsPath = join(process.cwd(), 'uploads');
  app.use('/uploads', express.static(uploadsPath, {
    maxAge: configService.get<string>('NODE_ENV') === 'production' ? '7d' : '1d',
    etag: true,
    lastModified: true,
    immutable: true,
  }));
  
  // Enable graceful shutdown
  app.enableShutdownHooks();
  
  const port = configService.get<number>('PORT', 4000);
  await app.listen(port, '0.0.0.0'); // Listen on all interfaces
  
  logger.log(`🚀 Backend is running on http://localhost:${port}`);
  logger.log(`📁 Uploads directory: ${uploadsPath}`);
  logger.log(`🌍 Environment: ${configService.get<string>('NODE_ENV', 'development')}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
