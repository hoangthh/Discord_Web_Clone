import { Injectable } from '@nestjs/common';
import { DirectMessage } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

const MESSAGE_BATCH = 10;

@Injectable()
export class DirectMessageService {
  constructor(private prisma: PrismaService) {}

  async findDirectMessagesByConversationId({
    cursor,
    conversationId,
  }: {
    cursor: string;
    conversationId: string;
  }) {
    let messages: DirectMessage[] = [];

    if (cursor) {
      messages = await this.prisma.directMessage.findMany({
        take: MESSAGE_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId,
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
      messages = await this.prisma.directMessage.findMany({
        take: MESSAGE_BATCH,
        where: {
          conversationId,
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

  async findFirstDirectMessageSocket({
    directMessageId,
    conversationId,
  }: {
    directMessageId: string;
    conversationId: string;
  }) {
    const message = this.prisma.directMessage.findFirst({
      where: {
        id: directMessageId,
        conversationId,
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

  async editDirectMessageByDirectMessageIdSocket({
    directMessageId,
    content,
  }: {
    directMessageId: string;
    content: string;
  }) {
    const message = this.prisma.directMessage.update({
      where: {
        id: directMessageId,
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

  async deleteDirectMessageByDirectMessageIdSocket(directMessageId: string) {
    const message = this.prisma.directMessage.update({
      where: {
        id: directMessageId,
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

  async createDirectMessageSocket({
    content,
    fileUrl,
    conversationId,
    memberId,
  }: {
    content: string;
    fileUrl?: string;
    conversationId: string;
    memberId: string;
  }) {
    const message = this.prisma.directMessage.create({
      data: {
        content,
        fileUrl,
        conversationId,
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
