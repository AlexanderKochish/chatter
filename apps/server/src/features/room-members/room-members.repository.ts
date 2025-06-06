import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';

@Injectable()
export class RoomMembersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async isUserInRoom(roomId: string, userId: string) {
    return await this.prisma.roomMembers.findFirst({
      where: { roomId, userId },
    });
  }
}
