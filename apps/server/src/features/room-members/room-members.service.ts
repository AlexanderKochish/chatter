import { Injectable } from '@nestjs/common';
import { RoomMembersRepository } from './room-members.repository';

@Injectable()
export class RoommembersService {
  constructor(private readonly roomMembersRepo: RoomMembersRepository) {}

  async isUserInRoom(roomId: string, userId: string) {
    return await this.roomMembersRepo.isUserInRoom(roomId, userId);
  }
}
