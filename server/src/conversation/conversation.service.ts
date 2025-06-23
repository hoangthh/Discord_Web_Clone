import { Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';

@Injectable()
export class ConversationService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateConversation(memberOneId: string, memberTwoId: string) {
    let conversation =
      (await this.findFirstConversation(memberOneId, memberTwoId)) ||
      (await this.findFirstConversation(memberTwoId, memberOneId));

    if (!conversation)
      conversation = await this.createNewConversation(memberOneId, memberTwoId);

    return conversation;
  }

  async findFirstConversation(memberOneId: string, memberTwoId: string) {
    return await this.prisma.conversation.findFirst({
      where: {
        AND: [{ memberOneId: memberOneId }, { memberTwoId: memberTwoId }],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async createNewConversation(memberOneId: string, memberTwoId: string) {
    return await this.prisma.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async findFirstConversationSocket({
    conversationId,
    profileId,
  }: {
    conversationId: string;
    profileId: string;
  }) {
    const conversation = this.prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          {
            memberOne: {
              profileId,
            },
          },
          {
            memberTwo: {
              profileId,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    return conversation;
  }
}
