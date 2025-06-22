import { Injectable } from '@nestjs/common';
import { Message } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

const MESSAGE_BATCH = 10;

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async findMessagesByChannelId({
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

  async findFirstMessageSocket({
    messageId,
    channelId,
  }: {
    messageId: string;
    channelId: string;
  }) {
    const message = this.prisma.message.findFirst({
      where: {
        id: messageId,
        channelId,
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

  async editMessageByMessageIdSocket({
    messageId,
    content,
  }: {
    messageId: string;
    content: string;
  }) {
    const message = this.prisma.message.update({
      where: {
        id: messageId,
      },
      data: {
        content,
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

  async deleteMessageByMessageIdSocket(messageId: string) {
    const message = this.prisma.message.update({
      where: {
        id: messageId,
      },
      data: {
        fileUrl: '',
        content: 'This message has been deleted.',
        deleted: true,
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
