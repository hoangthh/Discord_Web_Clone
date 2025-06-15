"use client";

import useSWR from "swr";
import { PublicConfiguration } from "swr/_internal";

export const useAuth = (options?: Partial<PublicConfiguration>) => {
  const {
    data: profile,
    error,
    isLoading,
  } = useSWR(`/auth/profile`, {
    dedupingInterval: 60 * 60 * 1000,
    revalidateOnFocus: false,
    ...options,
  });
  console.log({ profile });
  return { profile, error, isLoading };
};
