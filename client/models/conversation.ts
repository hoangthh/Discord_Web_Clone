import { ApiResponse, MemberWithProfile } from "@/models";

export interface Conversation extends ApiResponse {
  memberOneId: string;
  memberTwoId: string;
  memberOne: MemberWithProfile;
  memberTwo: MemberWithProfile;
}
