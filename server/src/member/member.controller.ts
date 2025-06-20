import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { MemberService } from './member.service';

interface RequestWithProfileId extends Request {
  profile: {
    profileId: string;
  };
}

@UseGuards(JwtAuthGuard)
@Controller('members')
export class MemberController {
  constructor(private memberService: MemberService) {}

  @Get('servers/:serverId')
  findFirstMemberByServerId(
    @Param('serverId') serverId: string,
    @Req() req: RequestWithProfileId,
  ) {
    return this.memberService.findFirstMemberByServerId({
      serverId,
      profileId: req.profile.profileId,
    });
  }
}
