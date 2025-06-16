import {
  Body,
  Controller,
  Get,
  Param,
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

  @Get('profile/:profileId')
  findServerByProfileId(@Param('profileId') profileId: string) {
    return this.serverService.findServerByProfileId(profileId);
  }

  @Get('if-member/:serverId')
  findServerByServerIdIfMember(
    @Param('serverId') serverId: string,
    @Req() req: RequestWithProfileId,
  ) {
    return this.serverService.findServerByServerIdIfMember({
      serverId,
      profileId: req.profile.profileId,
    });
  }

  @Get(':serverId')
  findServerByServerId(@Param('serverId') serverId: string) {
    return this.serverService.findServerByServerId({
      serverId,
    });
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
    }),
  ) // nhận file từ field 'image'
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
