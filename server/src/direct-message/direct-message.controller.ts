import { DirectMessageService } from './direct-message.service';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('direct-messages/conversations/:conversationId')
export class DirectMessageController {
  constructor(private directMessageService: DirectMessageService) {}

  @Get()
  findDirectMessagesByConversationId(
    @Query('cursor') cursor: string,
    @Param('conversationId') conversationId: string,
  ) {
    return this.directMessageService.findDirectMessagesByConversationId({
      cursor,
      conversationId,
    });
  }
}
