import { ApiResponse } from "./api-response";

export interface Profile extends ApiResponse {
  userId: string;
  name: string;
  email: string;
  imageUrl: string;
}
