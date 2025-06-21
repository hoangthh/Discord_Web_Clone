import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService) {}

  // GET: /api/channels/:channelId
  async findChannelByChannelId(channelId: string) {
    const channel = await this.prisma.channel.findUnique({
      where: {
        id: channelId,
      },
    });
    return channel;
  }

  async findFirstChannelSocket({
    channelId,
    serverId,
  }: {
    channelId: string;
    serverId: string;
  }) {
    const channel = await this.prisma.channel.findFirst({
      where: {
        id: channelId,
        serverId,
      },
    });
    return channel;
  }
}
