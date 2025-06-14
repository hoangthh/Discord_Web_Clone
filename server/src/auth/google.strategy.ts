// src/auth/google.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ProfileService } from 'src/profile/profile.service';

interface GoogleProfile {
  id: string;
  displayName: string;
  emails: [{ value: string }];
  photos: [{ value: string }];
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private profileService: ProfileService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    googleProfile: GoogleProfile,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, displayName, emails, photos } = googleProfile;
    const user = {
      userId: id,
      name: displayName,
      email: emails[0].value,
      imageUrl: photos[0].value,
    };
    const profile = await this.profileService.initializeProfile(user);
    done(null, profile.id);
  }
}
