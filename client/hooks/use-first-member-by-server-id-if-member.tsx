"use client";

import { MemberWithProfile } from "@/models";
import useSWR from "swr";
import { SWRConfiguration } from "swr/_internal";

export const useFirstMemberByServerIdIfMember = (
  serverId: string,
  options?: Partial<SWRConfiguration<MemberWithProfile>>,
) => {
  const {
    data: member,
    error,
    isLoading,
    mutate,
  } = useSWR<MemberWithProfile>(`/api/members/servers/${serverId}`, {
    ...options,
  });

  return {
    member,
    error,
    isLoading,
    mutate,
  };
};
