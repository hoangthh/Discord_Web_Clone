import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MemberService {
  constructor(private prisma: PrismaService) {}

  async findFirstMemberByServerId({
    serverId,
    profileId,
  }: {
    serverId: string;
    profileId: string;
  }) {
    const member = await this.prisma.member.findFirst({
      where: {
        serverId,
        profileId,
      },
      include: {
        profile: true,
      },
    });
    return member;
  }
}
