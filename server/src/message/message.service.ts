import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UploadService } from 'src/upload/upload.service';
import { randomUUID } from 'crypto';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  async saveMessage(dto: CreateMessageDto) {
    if (!dto.text && dto.images?.length === 0) {
      throw new BadRequestException('Message is not must be empty');
    }

    const imageUrl: string[] = [];

    for (const image of dto.images) {
      const fileBuffer = Buffer.from(image.buffer);

      const results = (await this.uploadService.uploadStreamBuffer(fileBuffer, {
        folder: 'chatter/messeges',
        resource_type: 'image',
        public_id: `${dto.ownerId}-${randomUUID()}`,
      })) as UploadApiResponse;

      imageUrl.push(results.secure_url);
    }

    return await this.prisma.message.create({
      data: {
        text: dto.text,
        roomId: dto.roomId,
        ownerId: dto.ownerId,
        images: {
          create: imageUrl.map((url) => ({ url })),
        },
      },
      include: {
        images: true,
      },
    });
  }

  async authorizeMessageAccess(roomId: string, msgId: string, ownerId: string) {
    const room = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: {
        members: {
          where: {
            userId: ownerId,
          },
        },
      },
    });

    if (!room || room.members.length === 0) {
      throw new ForbiddenException('You are not a member of this chat room');
    }

    const message = await this.prisma.message.findUnique({
      where: { id: msgId },
      select: { roomId: true },
    });

    if (!message || message.roomId !== roomId) {
      throw new NotFoundException('Message not found in this chat room');
    }

    return message;
  }

  async updateMessage(data: {
    roomId: string;
    msgId: string;
    ownerId: string;
    text: string;
  }) {
    await this.authorizeMessageAccess(data.roomId, data.msgId, data.ownerId);
    const message = await this.prisma.message.findUnique({
      where: { id: data.msgId },
      select: { ownerId: true, text: true },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.ownerId !== data.ownerId) {
      throw new ForbiddenException("You cannot edit someone else's message");
    }
    const isEdited = message.text !== data.text;

    return await this.prisma.message.update({
      where: { id: data.msgId },
      data: {
        text: data.text,
        edited: isEdited,
      },
    });
  }

  async removeMessage(data: {
    roomId: string;
    msgId: string;
    ownerId: string;
  }) {
    await this.authorizeMessageAccess(data.roomId, data.msgId, data.ownerId);
    return await this.prisma.message.delete({ where: { id: data.msgId } });
  }
}
