import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  async findOwnProfile(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        members: true,
        createdRooms: true,
        messages: true,
      },
    });
  }

  async updateProfile(
    id: string,
    uDto: UpdateProfileDto,
    file: Express.Multer.File,
  ) {
    const profile = await this.findOwnProfile(id);

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

    return await this.prisma.profile.update({
      where: { userId: id },
      data: {
        user: {
          update: {
            name: dataToUpdate.username,
          },
        },
        avatar: profileAvatar,
        bgImage: uDto.bgImage,
        bio: dataToUpdate.bio,
      },
    });
  }
}
