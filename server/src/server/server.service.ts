import { CloudinaryService } from './../services/cloudinary/cloudinary.service';
import { Injectable } from '@nestjs/common';
import { ChannelType, Member, MemberRole, Server } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

interface ServerWithMembers extends Server {
  members: Member[];
}

@Injectable()
export class ServerService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

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
            profileId,
          },
        },
      },
    });
    return server;
  }

  // GET: /api/server/:serverId/channels/general
  async findGeneralChannelServerByServerId({
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
            profileId,
          },
        },
      },
      include: {
        channels: {
          where: {
            name: 'general',
          },
          orderBy: {
            createdAt: 'asc',
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

  // PATCH: /api/servers/:serverId
  async editServer({
    serverId,
    profileId,
    name,
    imageUrl,
  }: {
    serverId: string;
    profileId: string;
    name: string;
    imageUrl?: string;
  }) {
    const dataToUpdate: { name: string; imageUrl?: string } = { name };
    if (imageUrl) dataToUpdate.imageUrl = imageUrl;

    const server = await this.prisma.server.update({
      where: {
        id: serverId,
        profileId,
      },
      data: dataToUpdate,
    });

    return server;
  }

  // PATCH: /api/servers/:serverId/leave
  async leaveServer({
    serverId,
    profileId,
  }: {
    serverId: string;
    profileId: string;
  }) {
    const server = await this.prisma.server.update({
      where: {
        id: serverId,
        profileId: {
          not: profileId,
        },
        members: {
          some: {
            profileId,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId,
          },
        },
      },
    });

    return server;
  }

  // PATCH: /api/servers/:serverId/invite-code
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

  // PATCH: /api/servers/:serverId/members/:memberId
  async changeMemberRole({
    serverId,
    profileId,
    memberId,
    role,
  }: {
    serverId: string;
    profileId: string;
    memberId: string;
    role: MemberRole;
  }) {
    const server = await this.prisma.server.update({
      where: {
        id: serverId,
        profileId,
      },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
              profileId: {
                not: profileId,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
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

  // PATCH: /api/servers/:serverId/channels/:channelId
  async editChannel({
    serverId,
    channelId,
    profileId,
    name,
    type,
  }: {
    serverId: string;
    channelId: string;
    profileId: string;
    name: string;
    type: ChannelType;
  }) {
    const server = await this.prisma.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: channelId,
              NOT: {
                name: 'general',
              },
            },
            data: {
              name,
              type,
            },
          },
        },
      },
    });
    return server;
  }

  // POST: /api/servers
  async createServer({
    name,
    image,
    profileId,
  }: {
    name: string;
    image: Express.Multer.File;
    profileId: string;
  }) {
    let cloudinaryUrl = '';
    if (image)
      cloudinaryUrl = await this.cloudinaryService.uploadFile(image.buffer);

    const newServer = this.prisma.server.create({
      data: {
        name,
        imageUrl: cloudinaryUrl,
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

  // POST: /api/servers/:serverId/channels
  async createChannel({
    serverId,
    profileId,
    name,
    type,
  }: {
    serverId: string;
    profileId: string;
    name: string;
    type: ChannelType;
  }) {
    const server = await this.prisma.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId,
            role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] },
          },
        },
      },
      data: {
        channels: {
          create: {
            profileId,
            name,
            type,
          },
        },
      },
    });
    return server;
  }

  // POST: /api/servers/:inviteCode/member
  async addMember({
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

  // DELETE: /api/servers/:serverId
  async deleteServer({
    serverId,
    profileId,
  }: {
    serverId: string;
    profileId: string;
  }) {
    const server = await this.prisma.server.delete({
      where: {
        id: serverId,
        profileId,
      },
    });
    return server;
  }

  // DELETE: /api/servers/:serverId/channels/:channelId
  async deleteChannel({
    serverId,
    channelId,
    profileId,
  }: {
    serverId: string;
    channelId: string;
    profileId: string;
  }) {
    const server = await this.prisma.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: channelId,
            name: {
              not: 'general',
            },
          },
        },
      },
    });
    return server;
  }

  // DELETE: /api/servers/:serverId/members/:memberId
  async kickMember({
    serverId,
    profileId,
    memberId,
  }: {
    serverId: string;
    profileId: string;
    memberId: string;
  }) {
    const server = await this.prisma.server.update({
      where: {
        id: serverId,
        profileId,
      },
      data: {
        members: {
          deleteMany: {
            id: memberId,
            profileId: {
              not: profileId,
            },
          },
        },
      },
      include: {
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

  async findFirstServerSocket({
    serverId,
    profileId,
  }: {
    serverId: string;
    profileId: string;
  }): Promise<ServerWithMembers | null> {
    const server = await this.prisma.server.findFirst({
      where: {
        id: serverId,
        members: {
          some: {
            profileId,
          },
        },
      },
      include: {
        members: true,
      },
    });
    return server;
  }
}
