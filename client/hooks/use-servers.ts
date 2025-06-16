"use client";

import { axiosInstance } from "@/api-client";
import useSWR from "swr";
import { SWRConfiguration } from "swr/_internal";

export const useServers = (options?: Partial<SWRConfiguration>) => {
  const {
    data: servers,
    error,
    isLoading,
    mutate,
  } = useSWR(`/api/servers`, {
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

    await axiosInstance.post("/api/servers", formData, {
      withCredentials: true,
    });

    await mutate();
  };

  return {
    servers,
    error,
    isLoading,
    createServer,
  };
};
