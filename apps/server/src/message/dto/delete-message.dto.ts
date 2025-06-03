import { OmitType } from '@nestjs/mapped-types';
import { UpdateMessageDto } from './update-message.dto';

export class DeleteMessageDto extends OmitType(UpdateMessageDto, [
  'text',
  'images',
] as const) {}
