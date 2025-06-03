import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaModule } from 'src/services/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { UploadService } from 'src/upload/upload.service';
import { CloudinaryModule } from 'src/configs/cloudinary/cloudinary.module';

@Module({
  imports: [PrismaModule, UserModule, CloudinaryModule],
  controllers: [ProfileController],
  providers: [ProfileService, UploadService],
})
export class ProfileModule {}
