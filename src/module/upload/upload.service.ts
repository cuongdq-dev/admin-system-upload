import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  saveBase64Image(base64String: string, filename: string): string {
    const matches = base64String.match(/^data:(.+);base64,(.+)$/);
    if (!matches) throw new Error('Invalid base64 format');

    const ext = matches[1].split('/')[1]; // Lấy định dạng file (jpg, png,...)
    const buffer = Buffer.from(matches[2], 'base64');

    const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, `${filename}.${ext}`);
    fs.writeFileSync(filePath, buffer);

    return `/uploads/${filename}.${ext}`;
  }
}
