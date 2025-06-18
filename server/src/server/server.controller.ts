import {
  Body,
  Controller,
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

  @Post(':inviteCode/member')
  addMemberToServer(
    @Param('inviteCode') inviteCode: string,
    @Body('profileId') profileId: string,
  ) {
    return this.serverService.addMemberToServer({
      inviteCode,
      profileId,
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
    let cloudinaryUrl = '';
    if (image)
      cloudinaryUrl = await this.cloudinaryService.uploadFile(image.buffer);

    return this.serverService.createServer({
      name: body.name,
      imageUrl: cloudinaryUrl,
      profileId: req.profile.profileId,
    });
  }
}
