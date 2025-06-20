import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProfileModule } from './profile/profile.module';
import { ServerModule } from './server/server.module';
import { ChannelModule } from './channel/channel.module';
import { MemberModule } from './member/member.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    ProfileModule,
    ServerModule,
    ChannelModule,
    MemberModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
