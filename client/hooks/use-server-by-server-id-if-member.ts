"use client";

import { Server } from "@/models";
import useSWR from "swr";
import { SWRConfiguration } from "swr/_internal";

export const useServerByServerIdIfMember = (
  serverId: string,
  options?: Partial<SWRConfiguration<Server>>,
) => {
  const {
    data: server,
    error,
    isLoading,
  } = useSWR<Server>(`/api/servers/if-member/${serverId}`, {
    ...options,
  });

  return {
    server,
    error,
    isLoading,
  };
};
