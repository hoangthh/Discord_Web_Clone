import { Module } from '@nestjs/common';
import { MessageModule } from 'src/message/message.module';
import { SocketController } from './socket.controller';
import { SocketGateway } from './socket.gateway';
import { ServerModule } from 'src/server/server.module';
import { ChannelModule } from 'src/channel/channel.module';
import { CloudinaryModule } from 'src/services/cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule, ServerModule, ChannelModule, MessageModule],
  providers: [SocketGateway],
  controllers: [SocketController],
})
export class SocketModule {}
