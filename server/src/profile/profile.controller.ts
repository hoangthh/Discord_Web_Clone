import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ProfileService } from './profile.service';

interface RequestWithUser extends Request {
  profile: {
    userId: string;
    name: string;
    imageUrl: string;
    email: string;
  };
}

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  initializeProfile(@Req() req: RequestWithUser) {
    return this.profileService.initializeProfile(req.profile);
  }

  @Get(':profileId')
  getProfileById(@Param('profileId') profileId: string) {
    return this.profileService.getProfileById(profileId);
  }
}
