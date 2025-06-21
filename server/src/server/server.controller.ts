import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChannelType, MemberRole } from '@prisma/client';
import { Request } from 'express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CloudinaryService } from './../services/cloudinary/cloudinary.service';
import { ServerService } from './server.service';

interface ServerDTO {
  name: string;
}

interface RequestWithProfileId extends Request {
  profile: {
    profileId: string;
  };
}

@UseGuards(JwtAuthGuard)
@Controller('servers')
export class ServerController {
  constructor(
    private serverService: ServerService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  findAllServers(@Req() req: RequestWithProfileId) {
    return this.serverService.findAllServers(req.profile.profileId);
  }

  @Get(':serverId')
  findServerByServerId(@Param('serverId') serverId: string) {
    return this.serverService.findServerByServerId({
      serverId,
    });
  }

  @Get(':serverId/if-member')
  findServerByServerIdIfMember(
    @Param('serverId') serverId: string,
    @Req() req: RequestWithProfileId,
  ) {
    return this.serverService.findServerByServerIdIfMember({
      serverId,
      profileId: req.profile.profileId,
    });
  }

  @Get(':serverId/channels/general')
  findGeneralChannelServerByServerId(
    @Param('serverId') serverId: string,
    @Req() req: RequestWithProfileId,
  ) {
    // return { serverId, profileId: req.profile.profileId };
    return this.serverService.findGeneralChannelServerByServerId({
      serverId,
      profileId: req.profile.profileId,
    });
  }

  @Get('profile/:profileId')
  findServerByProfileId(@Param('profileId') profileId: string) {
    return this.serverService.findServerByProfileId(profileId);
  }

  @Get('invite-code/:inviteCode/if-member')
  findServerByInviteCodeIfMember(
    @Param('inviteCode') inviteCode: string,
    @Req() req: RequestWithProfileId,
  ) {
    return this.serverService.findServerByInviteCodeIfMember({
      inviteCode,
      profileId: req.profile.profileId,
    });
  }

  @Patch(':serverId')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
    }),
  )
  async editServer(
    @Param('serverId') serverId: string,
    @UploadedFile() image: Express.Multer.File,
    @Body('name') name: string,
    @Req() req: RequestWithProfileId,
  ) {
    const imageUrl = image
      ? await this.cloudinaryService.uploadFile(image.buffer)
      : undefined;

    return this.serverService.editServer({
      serverId,
      profileId: req.profile.profileId,
      name,
      imageUrl,
    });
  }

  @Patch(':serverId/leave')
  async leaveServer(
    @Param('serverId') serverId: string,
    @Req() req: RequestWithProfileId,
  ) {
    return this.serverService.leaveServer({
      serverId,
      profileId: req.profile.profileId,
    });
  }

  @Patch(':serverId/invite-code')
  changeInviteCode(
    @Param('serverId') serverId: string,
    @Req() req: RequestWithProfileId,
  ) {
    return this.serverService.changeInviteCode({
      serverId,
      profileId: req.profile.profileId,
    });
  }

  @Patch(':serverId/members/:memberId')
  changeMemberRole(
    @Param('serverId') serverId: string,
    @Param('memberId') memberId: string,
    @Req() req: RequestWithProfileId,
    @Body('role') role: MemberRole,
  ) {
    return this.serverService.changeMemberRole({
      serverId,
      profileId: req.profile.profileId,
      memberId,
      role,
    });
  }

  @Patch(':serverId/channels/:channelId')
  editChannel(
    @Param('serverId') serverId: string,
    @Param('channelId') channelId: string,
    @Req() req: RequestWithProfileId,
    @Body() body: { name: string; type: ChannelType },
  ) {
    return this.serverService.editChannel({
      serverId,
      channelId,
      profileId: req.profile.profileId,
      name: body.name,
      type: body.type,
    });
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
    }),
  )
  async createServer(
    @UploadedFile() image: Express.Multer.File,
    @Body() body: ServerDTO,
    @Req() req: RequestWithProfileId,
  ) {
    return this.serverService.createServer({
      name: body.name,
      image,
      profileId: req.profile.profileId,
    });
  }

  @Post(':serverId/channels')
  createChannel(
    @Param('serverId') serverId: string,
    @Req() req: RequestWithProfileId,
    @Body() body: { name: string; type: ChannelType },
  ) {
    return this.serverService.createChannel({
      serverId,
      profileId: req.profile.profileId,
      name: body.name,
      type: body.type,
    });
  }

  @Post(':inviteCode/member')
  addMember(
    @Param('inviteCode') inviteCode: string,
    @Body('profileId') profileId: string,
  ) {
    return this.serverService.addMember({
      inviteCode,
      profileId,
    });
  }

  @Delete(':serverId')
  deleteServer(
    @Param('serverId') serverId: string,
    @Req() req: RequestWithProfileId,
  ) {
    return this.serverService.deleteServer({
      serverId,
      profileId: req.profile.profileId,
    });
  }

  @Delete(':serverId/channels/:channelId')
  deleteChannel(
    @Param('serverId') serverId: string,
    @Param('channelId') channelId: string,
    @Req() req: RequestWithProfileId,
  ) {
    return this.serverService.deleteChannel({
      serverId,
      channelId,
      profileId: req.profile.profileId,
    });
  }

  @Delete(':serverId/members/:memberId')
  kickMember(
    @Param('serverId') serverId: string,
    @Param('memberId') memberId: string,
    @Req() req: RequestWithProfileId,
  ) {
    return this.serverService.kickMember({
      serverId,
      profileId: req.profile.profileId,
      memberId,
    });
  }
}
