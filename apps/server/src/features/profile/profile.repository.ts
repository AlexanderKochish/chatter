import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/services/prisma/prisma.service';

@Injectable()
export class ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

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

  async updateProfile(updateDto: {
    id: string;
    username?: string;
    profileAvatar?: string | null;
    bgImage?: string;
    bio?: string;
  }) {
    return await this.prisma.profile.update({
      where: { userId: updateDto.id },
      data: {
        user: {
          update: {
            name: updateDto.username,
          },
        },
        avatar: updateDto.profileAvatar,
        bgImage: updateDto.bgImage,
        bio: updateDto.bio,
      },
    });
  }
}
