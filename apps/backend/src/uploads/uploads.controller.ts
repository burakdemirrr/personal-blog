import { Controller, Post, UploadedFile, UseGuards, UseInterceptors, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

const uploadDir = join(process.cwd(), 'uploads');
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

const allowed = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp']);

@Controller('admin/uploads')
export class UploadsController {
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: uploadDir,
        filename: (_req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${unique}${extname(file.originalname).toLowerCase()}`);
        }
      }),
      fileFilter: (_req, file, cb) => {
        const ext = extname(file.originalname).toLowerCase();
        cb(null, allowed.has(ext));
      },
      limits: { fileSize: 5 * 1024 * 1024 }
    })
  )
  upload(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    const relative = `/uploads/${file.filename}`;
    const origin = process.env.PUBLIC_URL || `${req.protocol}://${req.get('host')}`;
    return { url: `${origin}${relative}` } as const;
  }
}


