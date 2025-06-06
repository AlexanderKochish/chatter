import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { CreateChatroomDto } from './dto/create-chat-room.dto';

@Injectable()
export class ChatroomRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findExistingRoom(dto: CreateChatroomDto) {
    return await this.prisma.chatRoom.findFirst({
      where: {
        isGroup: false,
        members: {
          some: {
            userId: dto.currentUserId,
          },
        },
        AND: {
          members: {
            some: {
              userId: dto.targetUserId,
            },
          },
        },
      },
    });
  }

  async createChatRoom(dto: CreateChatroomDto) {
    return await this.prisma.chatRoom.create({
      data: {
        isGroup: false,
        createdById: dto.currentUserId,
        members: {
          create: [
            {
              userId: dto.currentUserId,
              isMuted: false,
              isBanned: false,
            },
            {
              userId: dto.targetUserId,
              isMuted: false,
              isBanned: false,
            },
          ],
        },
      },
    });
  }

  async findChatByIdAndUserId(roomId: string, ownerId: string) {
    return await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: {
        members: {
          where: {
            userId: ownerId,
          },
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

  async loadRoomMessages(roomId: string, cursor?: string) {
    return await this.prisma.chatRoom.findFirst({
      where: { id: roomId },
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

  async loadMessagesWithImages(roomId: string) {
    return await this.prisma.chatRoom.findMany({
      where: { id: roomId },
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
  }

  async findOtherMember(roomId: string, userId: string) {
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
