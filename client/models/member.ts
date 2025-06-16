import { ApiResponse, Profile } from "@/models";

export const Role = {
  ADMIN: "ADMIN",
  MODERATOR: "MODERATOR",
  GUEST: "GUEST",
};

export type MemberRole = "ADMIN" | "MODERATOR" | "GUEST";

export interface Member extends ApiResponse {
  role: string;
  profileId: string;
  serverId: string;
}

export interface MemberWithProfile extends Member {
  profile: Profile;
}
