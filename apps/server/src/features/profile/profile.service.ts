import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UploadService } from '@/shared/upload/upload.service';
import { ProfileRepository } from './profile.repository';

@Injectable()
export class ProfileService {
  constructor(
    private readonly uploadService: UploadService,
    private readonly profileRepo: ProfileRepository,
  ) {}

  async findOwnProfile(id: string) {
    return await this.profileRepo.findOwnProfile(id);
  }

  async updateProfile(
    id: string,
    uDto: UpdateProfileDto,
    file: Express.Multer.File,
  ) {
    const profile = await this.profileRepo.findOwnProfile(id);

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    let profileAvatar = profile.profile?.avatar;
    if (file) {
      if (profile.profile?.avatarPublicId) {
        await this.uploadService.removeImage(profile.profile?.avatarPublicId);
      }
      const uploadeImage = await this.uploadService.uploadImage(file);

      profileAvatar = uploadeImage.secure_url;
    }

    const dataToUpdate: UpdateProfileDto = {};

    if (uDto.username) dataToUpdate.username = uDto.username;
    if (uDto.bio) dataToUpdate.bio = uDto.bio;

    return await this.profileRepo.updateProfile({
      id,
      profileAvatar,
      bgImage: dataToUpdate.bgImage,
      bio: dataToUpdate.bio,
      username: dataToUpdate.username,
    });
  }
}
