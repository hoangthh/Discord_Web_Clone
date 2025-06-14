import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';

@Module({
  providers: [CloudinaryService],
  exports: [CloudinaryService], // <-- cho phép module khác sử dụng
})
export class CloudinaryModule {}
