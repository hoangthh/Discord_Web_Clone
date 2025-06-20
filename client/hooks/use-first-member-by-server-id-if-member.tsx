"use client";

import { Member } from "@/models";
import useSWR from "swr";
import { SWRConfiguration } from "swr/_internal";

export const useFirstMemberByServerIdIfMember = (
  serverId: string,
  options?: Partial<SWRConfiguration<Member>>,
) => {
  const {
    data: member,
    error,
    isLoading,
    mutate,
  } = useSWR<Member>(`/api/members/servers/${serverId}`, {
    ...options,
  });

  return {
    member,
    error,
    isLoading,
    mutate,
  };
};
