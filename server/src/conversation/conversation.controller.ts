import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ConversationService } from './conversation.service';

@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class ConversationController {
  constructor(private conversationService: ConversationService) {}

  @Get('member-one/:memberOneId/member-two/:memberTwoId')
  getOrCreateConversation(
    @Param('memberOneId') memberOneId: string,
    @Param('memberTwoId') memberTwoId: string,
  ) {
    return this.conversationService.getOrCreateConversation(
      memberOneId,
      memberTwoId,
    );
  }
}
