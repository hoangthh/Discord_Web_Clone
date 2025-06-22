import { ApiResponse } from "./api-response";
import { MemberWithProfile } from "./member";

export interface Message extends ApiResponse {
  content: string;
  fileUrl: string;
  deleted: boolean;
}

export interface MessageWithMemberWithProfile extends Message {
  member: MemberWithProfile;
}
