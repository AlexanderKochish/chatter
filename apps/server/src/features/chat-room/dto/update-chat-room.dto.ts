import { PartialType } from '@nestjs/mapped-types';
import { CreateChatroomDto } from './create-chat-room.dto';

export class UpdateChatroomDto extends PartialType(CreateChatroomDto) {}
