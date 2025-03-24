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

      const extension = 'png'; // Lấy phần mở rộng từ base64 (png, jpg, jpeg,...)
      const buffer = Buffer.from(matches[2], 'base64');

      // Chuẩn hóa title thành tên file an toàn
      const sanitizedTitle = title.replace(/[^a-zA-Z0-9-_]/g, '_');
      const fileName = `${sanitizedTitle}.${extension}`;

      // **Tạo thư mục upload**
      const uploadDir = path.join(__dirname, '..', '..', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // **Đường dẫn file**
      const filePath = path.join(uploadDir, fileName);

      // **Ghi file ảnh**
      fs.writeFileSync(filePath, buffer);

      return { success: true, url: `/uploads/${fileName}` };
    } catch (error) {
      console.error('Upload error:', error);
      return { success: false, message: 'Upload failed' };
    }
  }
}
