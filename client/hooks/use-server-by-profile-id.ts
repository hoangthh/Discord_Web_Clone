"use client";

import { Server } from "@/models";
import useSWR from "swr";
import { SWRConfiguration } from "swr/_internal";

export const useServerByProfileId = (
  profileId: string,
  options?: Partial<SWRConfiguration<Server>>,
) => {
  const {
    data: server,
    error,
    isLoading,
  } = useSWR<Server>(`/api/servers/profile/${profileId}`, {
    ...options,
  });

  return {
    server,
    error,
    isLoading,
  };
};
