import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ChannelService } from './channel.service';

@UseGuards(JwtAuthGuard)
@Controller('channels')
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Get(':channelId')
  findChannelByChannelId(@Param('channelId') channelId: string) {
    return this.channelService.findChannelByChannelId(channelId);
  }
}
