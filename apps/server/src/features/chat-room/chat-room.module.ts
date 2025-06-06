import { Module } from '@nestjs/common';
import { ChatroomService } from './chat-room.service';
import { ChatroomController } from './chat-room.controller';
import { PrismaModule } from 'src/shared/services/prisma/prisma.module';
import { ChatroomRepository } from './chat-room.repository';
import { RoommembersModule } from '../room-members/room-members.module';

@Module({
  controllers: [ChatroomController],
  providers: [ChatroomService, ChatroomRepository],
  exports: [ChatroomService],
  imports: [PrismaModule, RoommembersModule],
})
export class ChatroomModule {}
