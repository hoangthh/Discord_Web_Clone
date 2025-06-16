"use client";

import { Profile } from "@/models";
import useSWR from "swr";
import { SWRConfiguration } from "swr/_internal";

export const useAuth = (options?: Partial<SWRConfiguration<Profile>>) => {
  const {
    data: profile,
    error,
    isLoading,
  } = useSWR<Profile>(`/api/auth/profile`, {
    ...options,
  });

  return { profile, error, isLoading };
};
