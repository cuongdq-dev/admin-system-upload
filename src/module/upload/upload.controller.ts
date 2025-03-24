import { Controller, Post, Body } from '@nestjs/common';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('base64')
  uploadBase64(@Body() body: { base64: string; filename: string }) {
    if (!body.base64 || !body.filename) {
      return { success: false, message: 'Base64 và filename là bắt buộc' };
    }

    try {
      const filePath = this.uploadService.saveBase64Image(
        body.base64,
        body.filename,
      );
      return { success: true, url: filePath };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
