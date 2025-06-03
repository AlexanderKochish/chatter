import { Module } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ChatroomController } from './chatroom.controller';
import { PrismaModule } from 'src/services/prisma/prisma.module';
import { MessageModule } from 'src/message/message.module';

@Module({
  controllers: [ChatroomController],
  providers: [ChatroomService],
  imports: [PrismaModule, MessageModule],
})
export class ChatroomModule {}
