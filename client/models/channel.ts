import { ApiResponse } from "./api-response";

export const ChannelType = {
  TEXT: "TEXT",
  AUDIO: "AUDIO",
  VIDEO: "VIDEO",
};

export type ChannelTypeEnum = "TEXT" | "AUDIO" | "VIDEO";

export interface Channel extends ApiResponse {
  name: string;
  type: string;
  profileId: string;
  serverId: string;
}
