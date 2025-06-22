import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

interface RequestWithProfileId extends Request {
  profile: {
    profileId: string;
  };
}

@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Get()
  findMessages(
    @Req() req: RequestWithProfileId,
    @Query('cursor') cursor: string,
    @Query('channelId') channelId: string,
  ) {
    return this.messageService.findMessages({
      cursor,
      channelId,
    });
  }
}
