"use client";

import useSWR from "swr";
import { PublicConfiguration } from "swr/_internal";
import { useAuth } from "./use-auth";
import { axiosInstance } from "@/api-client";

export const useServer = (options?: Partial<PublicConfiguration>) => {
  const { profile } = useAuth();

  const {
    data: server,
    error: serverError,
    isLoading: serverIsLoading,
  } = useSWR(`/server/${profile?.id}`, {
    dedupingInterval: 60 * 60 * 1000,
    revalidateOnFocus: false,
    ...options,
  });

  const {
    data: servers,
    error: serversError,
    isLoading: serversIsLoading,
    mutate,
  } = useSWR(`/server`, {
    // fallbackData: [],
    dedupingInterval: 60 * 60 * 1000,
    revalidateOnFocus: false,
    ...options,
  });

  const createServer = async ({
    name,
    image,
  }: {
    name: string;
    image: File | undefined;
  }) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", image || "");

    await axiosInstance.post("/server", formData, {
      withCredentials: true,
    });

    await mutate();
  };

  return {
    server,
    servers,
    serverError,
    serversError,
    serverIsLoading,
    serversIsLoading,
    createServer,
  };
};
