import { Module } from '@nestjs/common';
import { CloudinaryModule } from 'src/services/cloudinary/cloudinary.module';
import { ServerController } from './server.controller';
import { ServerService } from './server.service';

@Module({
  imports: [CloudinaryModule],
  controllers: [ServerController],
  providers: [ServerService],
  exports: [ServerService],
})
export class ServerModule {}
