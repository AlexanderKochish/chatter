import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UploadService } from '@/shared/upload/upload.service';
import { randomUUID } from 'crypto';
import { UploadApiResponse } from 'cloudinary';
import { MessageRepository } from './message.repository';
import { UpdateMessageDto } from './dto/update-message.dto';
import { DeleteMessageDto } from './dto/delete-message.dto';
import { ChatroomService } from '../chat-room/chat-room.service';

@Injectable()
export class MessageService {
  constructor(
    private readonly uploadService: UploadService,
    private readonly messageRepo: MessageRepository,
    private readonly chatRoomService: ChatroomService,
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

    return await this.messageRepo.createMessage(dto, imageUrl);
  }

  async authorizeMessageAccess(data: DeleteMessageDto) {
    const room = await this.chatRoomService.findChatByIdAndUserId(
      data.roomId,
      data.ownerId,
    );

    if (!room || room.members.length === 0) {
      throw new ForbiddenException('You are not a member of this chat room');
    }

    const message = await this.messageRepo.findMessageIncludeId(data.msgId);

    if (!message || message.roomId !== data.roomId) {
      throw new NotFoundException('Message not found in this chat room');
    }

    return message;
  }

  async updateMessage(data: UpdateMessageDto) {
    await this.authorizeMessageAccess(data);
    const message = await this.messageRepo.findMessageById(data.msgId);

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.ownerId !== data.ownerId) {
      throw new ForbiddenException("You cannot edit someone else's message");
    }
    const isEdited = message.text !== data.text;

    const updateData = {
      text: data.text,
      msgId: data.msgId,
      isEdited,
    };

    return await this.messageRepo.updateMessage(updateData);
  }

  async removeMessage(data: DeleteMessageDto) {
    await this.authorizeMessageAccess(data);
    return await this.messageRepo.removeMessageById(data.msgId);
  }
}
