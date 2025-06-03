import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class ChatroomService {
  constructor(private readonly prisma: PrismaService) {}
  async findExistingRoom(currentUserId: string, targetUserId: string) {
    return await this.prisma.chatRoom.findFirst({
      where: {
        isGroup: false,
        members: {
          some: {
            userId: currentUserId,
          },
        },
        AND: {
          members: {
            some: {
              userId: targetUserId,
            },
          },
        },
      },
    });
  }
  async create(userId: string, targetUserId: string) {
    const existingRoom = await this.findExistingRoom(userId, targetUserId);

    if (existingRoom) {
      return existingRoom;
    }

    return await this.prisma.chatRoom.create({
      data: {
        isGroup: false,
        createdById: userId,
        members: {
          create: [
            {
              userId: userId,
              isMuted: false,
              isBanned: false,
            },
            {
              userId: targetUserId,
              isMuted: false,
              isBanned: false,
            },
          ],
        },
      },
    });
  }

  async findAllChatRoom(id: string) {
    return await this.prisma.chatRoom.findMany({
      where: {
        members: {
          some: {
            userId: id,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                profile: true,
              },
            },
          },
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }

  async findOneChat(roomId: string, userId: string, cursor?: string) {
    const room = await this.prisma.roomMembers.findFirst({
      where: { roomId, userId },
    });

    if (!room) {
      throw new UnauthorizedException('Room not found');
    }

    return await this.prisma.chatRoom.findFirst({
      where: { id: room.roomId },
      include: {
        messages: {
          include: {
            images: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 20,
          skip: cursor ? 1 : 0,
          cursor: cursor ? { id: cursor } : undefined,
        },
      },
    });
  }

  async getAllImagesOfChat(roomId: string, userId: string) {
    const room = await this.prisma.roomMembers.findFirst({
      where: { roomId, userId },
    });

    if (!room) {
      throw new UnauthorizedException('Room not found');
    }

    const data = await this.prisma.chatRoom.findMany({
      where: { id: room.roomId },
      include: {
        messages: {
          where: {
            images: {
              some: {
                url: {
                  not: '',
                },
              },
            },
          },
          select: {
            images: {
              select: {
                id: true,
                url: true,
                messageId: true,
              },
            },
          },
          // take: 20,
          // skip: cursor ? 1 : 0,
          // cursor: cursor ? { id: cursor } : undefined,
        },
      },
    });

    const images = data[0].messages.map(({ images }) => ({
      messageId: images[0].messageId,
      url: images[0].url,
      id: images[0].id,
    }));

    return images;
  }

  async getCompanion(roomId: string, userId: string) {
    const room = await this.prisma.roomMembers.findFirst({
      where: { roomId, userId },
    });

    if (!room) {
      throw new UnauthorizedException('Room not found');
    }

    return await this.prisma.roomMembers.findFirst({
      where: { roomId, NOT: { userId } },
      include: {
        user: {
          select: {
            email: true,
            name: true,
            profile: {
              select: {
                avatar: true,
              },
            },
          },
        },
      },
    });
  }
}
