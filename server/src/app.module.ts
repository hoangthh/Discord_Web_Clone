import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProfileModule } from './profile/profile.module';
import { ServerModule } from './server/server.module';
import { ChannelModule } from './channel/channel.module';
import { MemberModule } from './member/member.module';
import { ConversationModule } from './conversation/conversation.module';
import { SocketModule } from './socket/socket.module';
import { MessageModule } from './message/message.module';
import { DirectMessageModule } from './direct-message/direct-message.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    ProfileModule,
    ServerModule,
    ChannelModule,
    MemberModule,
    ConversationModule,
    SocketModule,
    MessageModule,
    DirectMessageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
