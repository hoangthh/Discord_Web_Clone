import { Injectable } from '@nestjs/common';
import { MemberRole } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ServerService {
  constructor(private prisma: PrismaService) {}

  // GET: /api/servers
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

  // GET: /api/server/:serverId
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

  // GET: /api/server/:serverId/if-member
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

  // GET: /api/server/profile/:profile-id
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

  // GET: /api/server/invite-code/:inviteCode/if-member
  async findServerByInviteCodeIfMember({
    inviteCode,
    profileId,
  }: {
    inviteCode: string;
    profileId: string;
  }) {
    const server = await this.prisma.server.findFirst({
      where: {
        inviteCode,
        members: {
          some: {
            profileId: profileId,
          },
        },
      },
    });
    return server;
  }

  // PATCH: /api/servers/invite-code
  async changeInviteCode({
    serverId,
    profileId,
  }: {
    serverId: string;
    profileId: string;
  }) {
    const server = await this.prisma.server.update({
      where: {
        id: serverId,
        profileId,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });
    return server;
  }

  // POST: /api/servers/:inviteCode/member
  async addMemberToServer({
    inviteCode,
    profileId,
  }: {
    inviteCode: string;
    profileId: string;
  }) {
    const server = await this.prisma.server.update({
      where: {
        inviteCode,
      },
      data: {
        members: {
          create: [
            {
              profileId,
            },
          ],
        },
      },
    });
    return server;
  }

  // POST: /api/servers
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
