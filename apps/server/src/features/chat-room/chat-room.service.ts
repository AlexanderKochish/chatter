import { ForbiddenException, Injectable } from '@nestjs/common';
import { ChatroomRepository } from './chat-room.repository';
import { CreateChatroomDto } from './dto/create-chat-room.dto';
import { RoommembersService } from 'src/features/room-members/room-members.service';

@Injectable()
export class ChatroomService {
  constructor(
    private readonly chatRoomRepo: ChatroomRepository,
    private readonly roomMembersService: RoommembersService,
  ) {}

  async verifyUserAccessToRoom(roomId: string, userId: string) {
    const isMember = await this.roomMembersService.isUserInRoom(roomId, userId);

    if (!isMember) {
      throw new ForbiddenException('You are not a member of this room');
    }
  }

  async create(dto: CreateChatroomDto) {
    const existingRoom = await this.chatRoomRepo.findExistingRoom(dto);

    if (existingRoom) {
      return existingRoom;
    }

    return await this.chatRoomRepo.createChatRoom(dto);
  }

  async findAllChatRoom(id: string) {
    return await this.chatRoomRepo.findAllChatRoom(id);
  }

  async findOneChat(roomId: string, userId: string, cursor?: string) {
    return await this.chatRoomRepo.loadRoomMessages(roomId, cursor);
  }

  async getAllImagesOfChat(roomId: string, userId: string) {
    await this.verifyUserAccessToRoom(roomId, userId);

    const data = await this.chatRoomRepo.loadMessagesWithImages(roomId);

    const images = data[0].messages.map(({ images }) => ({
      messageId: images[0].messageId,
      url: images[0].url,
      id: images[0].id,
    }));

    return images;
  }

  async getCompanion(roomId: string, userId: string) {
    await this.verifyUserAccessToRoom(roomId, userId);

    return await this.chatRoomRepo.findOtherMember(roomId, userId);
  }

  async findChatByIdAndUserId(roomId: string, ownerId: string) {
    return await this.chatRoomRepo.findChatByIdAndUserId(roomId, ownerId);
  }
}
