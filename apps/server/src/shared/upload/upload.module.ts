import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { CloudinaryModule } from 'src/shared/configs/cloudinary/cloudinary.module';

@Module({
  providers: [UploadService],
  imports: [CloudinaryModule],
  exports: [UploadService],
})
export class UploadModule {}
