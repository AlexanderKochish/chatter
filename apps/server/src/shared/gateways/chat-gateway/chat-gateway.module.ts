import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MessageModule } from '@/features/message/message.module';
import { RedisModule } from '@/shared/redis/redis.module';
import { UploadModule } from '@/shared/upload/upload.module';

@Module({
  providers: [ChatGateway],
  imports: [MessageModule, RedisModule, UploadModule],
})
export class EventsModule {}
