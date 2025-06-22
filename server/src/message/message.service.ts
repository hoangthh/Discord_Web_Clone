import { Injectable } from '@nestjs/common';
import { Message } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

const MESSAGE_BATCH = 10;

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async findMessages({
    cursor,
    channelId,
  }: {
    cursor: string;
    channelId: string;
  }) {
    let messages: Message[] = [];

    if (cursor) {
      messages = await this.prisma.message.findMany({
        take: MESSAGE_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      messages = await this.prisma.message.findMany({
        take: MESSAGE_BATCH,
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    let nextCursor = '';

    if (messages.length === MESSAGE_BATCH) {
      nextCursor = messages[MESSAGE_BATCH - 1].id;
    }

    return {
      items: messages,
      nextCursor,
    };
  }

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
