"use client";

import useSWR from "swr";
import { PublicConfiguration } from "swr/_internal";
import { useAuth } from "./use-auth";

export const useServer = (options?: Partial<PublicConfiguration>) => {
  const { profile } = useAuth();
  const {
    data: server,
    error: serverError,
    isLoading: serverIsLoading,
  } = useSWR(`/server/${profile.id}`, {
    dedupingInterval: 60 * 60 * 1000,
    revalidateOnFocus: false,
    ...options,
  });

  const {
    data: servers,
    error: serversError,
    isLoading: serversIsLoading,
  } = useSWR(`/server`, {
    dedupingInterval: 60 * 60 * 1000,
    revalidateOnFocus: false,
    ...options,
  });

  return {
    server,
    servers,
    serverError,
    serversError,
    serverIsLoading,
    serversIsLoading,
  };
};

// client gọi lên /auth/me -> lấy thông tin cá nhân bao gồm list server -> đưa vô api call gọi trả về server
