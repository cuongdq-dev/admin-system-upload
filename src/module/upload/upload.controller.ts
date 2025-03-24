import { Controller, Post, Body } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Controller('upload')
export class UploadController {
  @Post()
  async uploadImage(@Body() body: { image: string; title: string }) {
    const { image, title } = body;
    if (!image || !title) {
      return { success: false, message: 'Missing image or title' };
    }

    try {
      // Kiểm tra định dạng base64
      const matches = image.match(/^data:image\/(\w+);base64,(.+)$/);
      if (!matches) {
        return { success: false, message: 'Invalid image format' };
      }

      const extension = matches[1]; // Lấy đúng extension từ base64 (png, jpg,...)
      const buffer = Buffer.from(matches[2], 'base64');

      // **Lưu vào thư mục uploads ngoài cùng, tránh dist/**
      const uploadDir = path.join(__dirname, '..', '..', '..', 'uploads');
      const fileName = `${title}.${extension}`;
      const filePath = path.join(uploadDir, fileName);

      // **Tạo thư mục nếu chưa tồn tại**
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // **Ghi file ảnh**
      fs.writeFileSync(filePath, buffer);

      return { success: true, url: `/uploads/${fileName}` };
    } catch (error) {
      console.error('Upload error:', error);
      return { success: false, message: 'Upload failed' };
    }
  }
}
