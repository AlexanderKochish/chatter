import { Module } from '@nestjs/common';
import { RoommembersService } from './room-members.service';
import { PrismaModule } from '@/shared/services/prisma/prisma.module';
import { RoomMembersRepository } from './room-members.repository';

@Module({
  providers: [RoommembersService, RoomMembersRepository],
  imports: [PrismaModule],
  exports: [RoommembersService],
})
export class RoommembersModule {}
