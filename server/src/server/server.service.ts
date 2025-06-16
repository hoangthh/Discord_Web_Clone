import { Injectable } from '@nestjs/common';
import { MemberRole } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ServerService {
  constructor(private prisma: PrismaService) {}

  async findAllServers(profileId: string) {
    const servers = await this.prisma.server.findMany({
      where: {
        members: {
          some: {
            profileId,
          },
        },
      },
    });
    return servers;
  }

  async findServerByProfileId(profileId: string) {
    const server = await this.prisma.server.findFirst({
      where: {
        members: {
          some: {
            profileId,
          },
        },
      },
    });
    return server;
  }

  async findServerByServerIdIfMember({
    serverId,
    profileId,
  }: {
    serverId: string;
    profileId: string;
  }) {
    const server = await this.prisma.server.findUnique({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profileId,
          },
        },
      },
    });
    return server;
  }

  async findServerByServerId({ serverId }: { serverId: string }) {
    const server = await this.prisma.server.findUnique({
      where: {
        id: serverId,
      },
      include: {
        channels: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: 'asc',
          },
        },
      },
    });
    return server;
  }

  async createServer({
    name,
    imageUrl,
    profileId,
  }: {
    name: string;
    imageUrl: string;
    profileId: string;
  }) {
    const newServer = this.prisma.server.create({
      data: {
        name,
        imageUrl,
        inviteCode: uuidv4(),
        profileId,
        channels: {
          create: [{ name: 'general', profileId }],
        },
        members: {
          create: [{ profileId, role: MemberRole.ADMIN }],
        },
      },
    });
    return newServer;
  }
}
