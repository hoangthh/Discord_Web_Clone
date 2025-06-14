import { Injectable } from '@nestjs/common';
import { MemberRole } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ServerService {
  constructor(private prisma: PrismaService) {}

  async findServer(profileId: string) {
    const server = await this.prisma.server.findFirst({
      where: {
        members: {
          some: {
            profileId,
          },
        },
      },
    });
    console.log(server);
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
