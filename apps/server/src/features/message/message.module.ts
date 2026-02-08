import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { PrismaModule } from '@/shared/services/prisma/prisma.module';
import { UploadModule } from '@/shared/upload/upload.module';
import { MessageRepository } from './message.repository';
import { ChatroomModule } from '../chat-room/chat-room.module';

@Module({
  providers: [MessageService, MessageRepository],
  exports: [MessageService],
  imports: [PrismaModule, UploadModule, ChatroomModule],
})
export class MessageModule {}
