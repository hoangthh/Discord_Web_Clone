"use client";

import useSWR, { SWRConfiguration } from "swr";
import { Server, Channel, Member } from "@/models";

export type ServerApiUrl =
  | "createServer"
  | "invite"
  | "editServer"
  | "members"
  | "createChannel"
  | "leaveServer"
  | "deleteServer"
  | "deleteChannel"
  | "editChannel";

interface ServerParam {}

export const useServer = (
  serverApiUrl: ServerApiUrl,
  // key: T, // dùng để xác định type trả về
  param: ServerParam,
  options?: Partial<SWRConfiguration>,
) => {
  const { data, error, isLoading, mutate } = useSWR(serverApiUrl, {
    ...options,
  });

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
