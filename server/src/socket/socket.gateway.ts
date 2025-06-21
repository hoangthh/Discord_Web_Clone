// src/socket/socket.gateway.ts

import { NotFoundException } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
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
    const server = await this.serverService.findFirstServerSocket({
      serverId,
      profileId,
    });

    if (!server) throw new NotFoundException({ message: 'Server not found' });

    const channel = await this.channelService.findFirstChannelSocket({
      channelId,
      serverId,
    });

    if (!channel) throw new NotFoundException({ message: 'Channel not found' });

    const member = server.members.find(
      (member) => member.profileId === profileId,
    );

    if (!member) throw new NotFoundException({ message: 'Member not found' });

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
