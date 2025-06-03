import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { PrismaModule } from 'src/services/prisma/prisma.module';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  providers: [MessageService],
  exports: [MessageService],
  imports: [PrismaModule, UploadModule],
})
export class MessageModule {}
