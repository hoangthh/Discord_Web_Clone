import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async createMessageSocket({
    content,
    fileUrl,
    channelId,
    memberId,
  }: {
    content: string;
    fileUrl?: string;
    channelId: string;
    memberId: string;
  }) {
    const message = this.prisma.message.create({
      data: {
        content,
        fileUrl,
        channelId,
        memberId,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });
    return message;
  }
}
