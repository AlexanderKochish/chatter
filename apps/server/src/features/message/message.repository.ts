import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMessageById(id: string) {
    return await this.prisma.message.findUnique({
      where: { id },
      select: { ownerId: true, text: true },
    });
  }

  async findMessageIncludeId(id: string) {
    return await this.prisma.message.findUnique({
      where: { id },
      select: { roomId: true },
    });
  }

  async createMessage(dto: CreateMessageDto, imageUrl: string[]) {
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

  async updateMessage(data: {
    msgId: string;
    text: string;
    isEdited: boolean;
  }) {
    return await this.prisma.message.update({
      where: { id: data.msgId },
      data: {
        text: data.text,
        edited: data.isEdited,
      },
    });
  }

  async removeMessageById(id: string) {
    return await this.prisma.message.delete({ where: { id } });
  }
}
