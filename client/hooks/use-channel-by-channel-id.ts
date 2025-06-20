"use client";

import { Channel } from "@/models";
import useSWR from "swr";
import { SWRConfiguration } from "swr/_internal";

export const useChannelByChannelId = (
  channelId: string,
  options?: Partial<SWRConfiguration<Channel>>,
) => {
  const {
    data: channel,
    error,
    isLoading,
    mutate,
  } = useSWR<Channel>(`/api/channels/${channelId}`, {
    ...options,
  });

  return {
    channel,
    error,
    isLoading,
    mutate,
  };
};
