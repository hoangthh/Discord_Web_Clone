"use client";

import { ServerWithChannel } from "@/models";
import useSWR from "swr";
import { SWRConfiguration } from "swr/_internal";

export const useServerWithGeneralChannelByServerId = (
  serverId: string,
  options?: Partial<SWRConfiguration<ServerWithChannel>>,
) => {
  const {
    data: server,
    error,
    isLoading,
    mutate,
  } = useSWR<ServerWithChannel>(`/api/servers/${serverId}/channels/general`, {
    ...options,
  });

  return {
    server,
    error,
    isLoading,
    mutate,
  };
};
