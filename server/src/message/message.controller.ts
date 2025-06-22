import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { MessageService } from './message.service';

@UseGuards(JwtAuthGuard)
@Controller('messages/channels/:channelId')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Get()
  findMessagesByChannelId(
    @Query('cursor') cursor: string,
    @Param('channelId') channelId: string,
  ) {
    return this.messageService.findMessagesByChannelId({
      cursor,
      channelId,
    });
  }
}
