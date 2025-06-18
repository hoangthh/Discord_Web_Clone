"use client";

import { ServerWithChannelWithMember } from "@/models";
import useSWR from "swr";
import { SWRConfiguration } from "swr/_internal";

export const useServerByServerId = (
  serverId: string,
  options?: Partial<SWRConfiguration<ServerWithChannelWithMember>>,
) => {
  const {
    data: server,
    error,
    isLoading,
    mutate,
  } = useSWR<ServerWithChannelWithMember>(`/api/servers/${serverId}`, {
    ...options,
  });

  return {
    server,
    error,
    isLoading,
    mutate,
  };
};
