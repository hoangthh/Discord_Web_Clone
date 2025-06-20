import { ApiResponse } from "./api-response";
import { Channel, MemberWithProfile } from "@/models";

export interface Server extends ApiResponse {
  name: string;
  imageUrl: string;
  inviteCode: string;
  profileId: string;
}

export interface ServerWithChannelWithMember extends Server {
  channels: Channel[];
  members: MemberWithProfile[];
}

export interface ServerWithChannel extends Server {
  channels: Channel[];
}
