import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaModule } from '@/shared/services/prisma/prisma.module';
import { UserModule } from '@/features/user/user.module';
import { UploadService } from '@/shared/upload/upload.service';
import { CloudinaryModule } from '@/shared/configs/cloudinary/cloudinary.module';
import { ProfileRepository } from './profile.repository';

@Module({
  imports: [PrismaModule, UserModule, CloudinaryModule],
  controllers: [ProfileController],
  providers: [ProfileService, UploadService, ProfileRepository],
})
export class ProfileModule {}
