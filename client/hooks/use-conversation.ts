"use client";

import { Conversation } from "@/models";
import useSWR, { SWRConfiguration } from "swr";

export const useConversation = (
  memberOneId: string | undefined,
  memberTwoId: string,
  options?: Partial<SWRConfiguration<Conversation>>,
) => {
  const {
    data: conversation,
    error,
    isLoading,
    mutate,
  } = useSWR<Conversation>(
    `/api/conversations/member-one/${memberOneId}/member-two/${memberTwoId}`,
    {
      ...options,
    },
  );

  return {
    conversation,
    isLoading,
    error,
    mutate,
  };
};
