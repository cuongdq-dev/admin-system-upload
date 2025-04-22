import { Controller, Get } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    try {
      const uploadDir = path.join(__dirname, '..', 'uploads');

      if (!fs.existsSync(uploadDir)) {
        return { success: true, files: [] };
      }

      const files = fs.readdirSync(uploadDir);
      const imageFiles = files.filter((file) =>
        /\.(png|jpe?g|gif|webp)$/i.test(file),
      );

      return {
        success: true,
        files: imageFiles.map((name) => ({
          name,
          url: `/uploads/${name}`,
        })),
      };
    } catch (error) {
      console.error('List error:', error);
      return { success: false, message: 'Failed to list files' };
    }
  }
}
