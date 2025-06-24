// src/auth/auth.controller.ts
import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { ProfileService } from 'src/profile/profile.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

interface RequestWithProfile extends Request {
  profile: {
    profileId: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(
    private jwtService: JwtService,
    private profileService: ProfileService,
  ) {}

  @Get('hello')
  hello() {
    return 'hello';
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // redirect tới Google login
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const profileId = req.user; // từ Google strategy trả về

    const token = this.jwtService.sign({ profileId });

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    const redirectUrl = `${process.env.FRONTEND_URL}`;
    return res.redirect(redirectUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: RequestWithProfile) {
    const profileId = req.profile.profileId;
    return this.profileService.getProfileById(profileId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    return { message: 'Logout successfully' };
  }
}
