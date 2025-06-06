import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MessageModule } from 'src/features/message/message.module';
import { RedisModule } from 'src/shared/redis/redis.module';
import { UploadModule } from 'src/shared/upload/upload.module';

@Module({
  providers: [ChatGateway],
  imports: [MessageModule, RedisModule, UploadModule],
})
export class EventsModule {}
