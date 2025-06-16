"use client";

import { axiosInstance } from "@/api-client";
import { Server } from "@/models";
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
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", image || "");

      await axiosInstance.post("/api/servers", formData);

      await mutate();
    } catch (error) {
      console.log(error);
    }
  };

  const joinServer = async ({
    inviteCode,
    profileId,
  }: {
    inviteCode: string;
    profileId: string;
  }) => {
    try {
      const server: Server = await axiosInstance.post(
        `/api/servers/${inviteCode}/member`,
        {
          profileId,
        },
      );

      await mutate();

      return server;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    servers,
    error,
    isLoading,
    createServer,
    joinServer,
  };
};
