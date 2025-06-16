"use client";

import { Server } from "@/models";
import useSWR from "swr";
import { SWRConfiguration } from "swr/_internal";

export const useServerByInviteCodeIfMember = (
  inviteCode: string,
  options?: Partial<SWRConfiguration<Server>>,
) => {
  const {
    data: server,
    error,
    isLoading,
  } = useSWR<Server>(`/api/servers/invite-code/${inviteCode}/if-member`, {
    ...options,
  });

  return {
    server,
    error,
    isLoading,
  };
};
