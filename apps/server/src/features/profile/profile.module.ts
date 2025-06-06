import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaModule } from 'src/shared/services/prisma/prisma.module';
import { UserModule } from 'src/features/user/user.module';
import { UploadService } from 'src/shared/upload/upload.service';
import { CloudinaryModule } from 'src/shared/configs/cloudinary/cloudinary.module';
import { ProfileRepository } from './profile.repository';

@Module({
  imports: [PrismaModule, UserModule, CloudinaryModule],
  controllers: [ProfileController],
  providers: [ProfileService, UploadService, ProfileRepository],
})
export class ProfileModule {}
