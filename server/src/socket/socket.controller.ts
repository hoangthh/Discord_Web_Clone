import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

interface CreateMessageBody {
  content: string;
  fileUrl: string;
  channelId: string;
  serverId: string;
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
    // return console.log({
    //   content: body.content,
    //   fileUrl: body.fileUrl,
    //   channelId: body.channelId,
    //   serverId: body.serverId,
    //   profileId: req.profile.profileId,
    // });

    return this.socketGateway.createMessage({
      content: body.content,
      image,
      channelId: body.channelId,
      serverId: body.serverId,
      profileId: req.profile.profileId,
    });
  }
}
