import { Module } from '@nestjs/common';
import { ChatGateway } from './events.gateway';
import { MessageModule } from 'src/message/message.module';
import { RedisModule } from 'src/redis/redis.module';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  providers: [ChatGateway],
  imports: [MessageModule, RedisModule, UploadModule],
})
export class EventsModule {}
