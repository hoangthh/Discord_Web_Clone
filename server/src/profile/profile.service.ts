import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

interface User {
  userId: string;
  name: string;
  imageUrl: string;
  email: string;
}

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async initializeProfile(user: User) {
    //Kiem tra xem co profile dua tren user
    const profile = await this.prisma.profile.findUnique({
      where: {
        userId: user.userId,
      },
    });

    if (profile) {
      return profile;
    }

    //Neu co profile roi thi tra ve profile
    const newProfile = await this.prisma.profile.create({
      data: {
        userId: user.userId,
        name: user.name,
        imageUrl: user.imageUrl,
        email: user.email,
      },
    });

    return newProfile;
  }

  async getProfileById(profileId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: {
        id: profileId,
      },
    });

    return profile;
  }
}
