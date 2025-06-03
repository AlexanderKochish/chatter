import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
  Query,
} from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { AuthRequest } from 'src/auth/types/auth.interface';
import { MessageService } from 'src/message/message.service';

@Controller('chats')
export class ChatroomController {
  constructor(
    private readonly chatroomService: ChatroomService,
    private readonly messageService: MessageService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('create')
  async create(
    @Body() data: { targetUserId: string },
    @Req() req: AuthRequest,
  ) {
    const { userId } = req['user'];
    return await this.chatroomService.create(userId, data.targetUserId);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Req() req: AuthRequest) {
    const user = req['user'];
    return await this.chatroomService.findAllChatRoom(user.userId);
  }

  @UseGuards(AuthGuard)
  @Get(':roomId')
  async findOneChat(
    @Param('roomId') roomId: string,
    @Req() req: AuthRequest,
    @Query('cursor') cursor?: string,
  ) {
    const userId = req['user'].userId;
    return await this.chatroomService.findOneChat(roomId, userId, cursor);
  }

  @UseGuards(AuthGuard)
  @Get(':roomId/images')
  async getAllImagesOfChat(
    @Param('roomId') roomId: string,
    @Req() req: AuthRequest,
  ) {
    const userId = req['user'].userId;
    return await this.chatroomService.getAllImagesOfChat(roomId, userId);
  }

  @UseGuards(AuthGuard)
  @Get(':roomId/companion')
  async getCompanion(@Param('roomId') roomId: string, @Req() req: AuthRequest) {
    const userId = req['user'].userId;
    return await this.chatroomService.getCompanion(roomId, userId);
  }
}
