import { ApiResponse } from "./api-response";
import { Channel, MemberWithProfile } from "@/models";

export interface Server extends ApiResponse {
  name: string;
  imageUrl: string;
  inviteCode: string;
  profileId: string;
}

export interface ServerWithChannelWithMember extends Server, ApiResponse {
  channels: Channel[];
  members: MemberWithProfile[];
}

// export interface Servers extends ApiResponse {
//   channels: Channel[];
//   members: Member[];
// }
