// src/socket/socket.gateway.ts

import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MemberRole } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { ChannelService } from 'src/channel/channel.service';
import { MessageService } from 'src/message/message.service';
import { ServerService } from 'src/server/server.service';
import { CloudinaryService } from 'src/services/cloudinary/cloudinary.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private cloudinaryService: CloudinaryService,
    private serverService: ServerService,
    private channelService: ChannelService,
    private messageService: MessageService,
  ) {}

  afterInit() {
    console.log('Socket-io initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  validateMessage = async ({
    channelId,
    serverId,
    profileId,
  }: {
    channelId: string;
    serverId: string;
    profileId: string;
  }) => {
    const server = await this.serverService.findFirstServerSocket({
      serverId,
      profileId,
    });

    if (!server) throw new NotFoundException({ error: 'Server not found' });

    const channel = await this.channelService.findFirstChannelSocket({
      channelId,
      serverId,
    });

    if (!channel) throw new NotFoundException({ error: 'Channel not found' });

    const member = server.members.find(
      (member) => member.profileId === profileId,
    );

    if (!member) throw new NotFoundException({ error: 'Member not found' });

    return member;
  };

  async editMessageByMessageId({
    content,
    messageId,
    channelId,
    serverId,
    profileId,
  }: {
    content: string;
    messageId: string;
    channelId: string;
    serverId: string;
    profileId: string;
  }) {
    const member = await this.validateMessage({
      channelId,
      serverId,
      profileId,
    });

    let message = await this.messageService.findFirstMessageSocket({
      messageId,
      channelId,
    });

    if (!message || message.deleted)
      throw new NotFoundException({ error: 'Message not found' });

    const isMessageOwner = message.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) throw new UnauthorizedException({ error: 'Unauthorized' });
    if (!isMessageOwner)
      throw new UnauthorizedException({ error: 'Unauthorized' });

    message = await this.messageService.editMessageByMessageIdSocket({
      messageId,
      content,
    });

    const updateKey = `chat:${channelId}:message:update`;

    this.server.emit(updateKey, message);

    return message;
  }

  async deleteMessageByMessageId({
    messageId,
    channelId,
    serverId,
    profileId,
  }: {
    messageId: string;
    channelId: string;
    serverId: string;
    profileId: string;
  }) {
    const member = await this.validateMessage({
      channelId,
      serverId,
      profileId,
    });

    let message = await this.messageService.findFirstMessageSocket({
      messageId,
      channelId,
    });

    if (!message || message.deleted)
      throw new NotFoundException({ error: 'Message not found' });

    const isMessageOwner = message.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) throw new UnauthorizedException({ error: 'Unauthorized' });

    message =
      await this.messageService.deleteMessageByMessageIdSocket(messageId);

    const updateKey = `chat:${channelId}:message:update`;

    this.server.emit(updateKey, message);

    return message;
  }

  async createMessage({
    content,
    image,
    channelId,
    serverId,
    profileId,
  }: {
    content: string;
    image: Express.Multer.File;
    channelId: string;
    serverId: string;
    profileId: string;
  }) {
    const member = await this.validateMessage({
      channelId,
      serverId,
      profileId,
    });

    let cloudinaryUrl = '';
    if (image)
      cloudinaryUrl = await this.cloudinaryService.uploadFile(image.buffer);

    const message = await this.messageService.createMessageSocket({
      content,
      fileUrl: cloudinaryUrl,
      channelId,
      memberId: member.id,
    });

    const channelKey = `chat:${channelId}:messages`;

    this.server.emit(channelKey, message);

    return message;
  }
}
