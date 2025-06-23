import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateMessageDto } from './dto/update-message.dto';
import { SocketGateway } from './socket.gateway';
import { UpdateDirectMessageDto } from './dto/update-direct-message.dto';

interface UpdateMessageBody {
  content: string;
  channelId: string;
  serverId: string;
}

interface UpdateDirectMessageBody {
  content: string;
  conversationId: string;
}

interface CreateMessageBody extends UpdateMessageBody {
  fileUrl: string;
}

interface CreateDirectMessageBody extends UpdateDirectMessageBody {
  fileUrl: string;
}

interface RequestWithProfileId extends Request {
  profile: {
    profileId: string;
  };
}

@UseGuards(JwtAuthGuard)
@Controller('socket')
export class SocketController {
  constructor(private socketGateway: SocketGateway) {}

  @Patch('messages/:messageId')
  editMessageByMessageId(
    @Param('messageId') messageId: string,
    @Body() body: UpdateMessageDto,
    @Req() req: RequestWithProfileId,
  ) {
    return this.socketGateway.editMessageByMessageId({
      content: body.content,
      messageId,
      channelId: body.channelId,
      serverId: body.serverId,
      profileId: req.profile.profileId,
    });
  }

  @Patch('direct-messages/:directMessageId')
  editDirectMessageByDirectMessageId(
    @Param('directMessageId') directMessageId: string,
    @Body() body: UpdateDirectMessageDto,
    @Req() req: RequestWithProfileId,
  ) {
    return this.socketGateway.editDirectMessageByDirectMessageId({
      content: body.content,
      directMessageId,
      conversationId: body.conversationId,
      profileId: req.profile.profileId,
    });
  }

  @Delete('messages/:messageId')
  deleteMessageByMessageId(
    @Param('messageId') messageId: string,
    @Query('channelId') channelId: string,
    @Query('serverId') serverId: string,
    @Req() req: RequestWithProfileId,
  ) {
    return this.socketGateway.deleteMessageByMessageId({
      messageId,
      channelId,
      serverId,
      profileId: req.profile.profileId,
    });
  }

  @Delete('direct-messages/:directMessageId')
  deleteDirectMessageByDirectMessageId(
    @Param('directMessageId') directMessageId: string,
    @Query('conversationId') conversationId: string,
    @Req() req: RequestWithProfileId,
  ) {
    return this.socketGateway.deleteDirectMessageByDirectMessageId({
      directMessageId,
      conversationId,
      profileId: req.profile.profileId,
    });
  }

  @Post('messages')
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
    }),
  )
  createMessage(
    @UploadedFile() image: Express.Multer.File,
    @Body() body: CreateMessageBody,
    @Req() req: RequestWithProfileId,
  ) {
    return this.socketGateway.createMessage({
      content: body.content,
      image,
      channelId: body.channelId,
      serverId: body.serverId,
      profileId: req.profile.profileId,
    });
  }

  @Post('direct-messages')
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
    }),
  )
  createDirectMessage(
    @UploadedFile() image: Express.Multer.File,
    @Body() body: CreateDirectMessageBody,
    @Req() req: RequestWithProfileId,
  ) {
    return this.socketGateway.createDirectMessage({
      content: body.content,
      image,
      conversationId: body.conversationId,
      profileId: req.profile.profileId,
    });
  }
}
