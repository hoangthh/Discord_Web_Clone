"use client";

import { axiosInstance } from "@/api-client";
import { Channel, Server } from "@/models";
import { useServerByServerId } from "./use-server-by-server-id";

export const useChannel = (serverId: string) => {
  const { mutate } = useServerByServerId(serverId);

  const createChannel = async (
    serverId: string,
    values: { name: string; type: string },
  ) => {
    await axiosInstance.post(`/api/servers/${serverId}/channels`, values);

    await mutate();
  };

  const editChannel = async (
    server: Server,
    channel: Channel,
    values: { name: string; type: string },
  ) => {
    await axiosInstance.patch(
      `/api/servers/${server.id}/channels/${channel.id}`,
      values,
    );

    await mutate();
  };

  const deleteChannel = async (server: Server, channel: Channel) => {
    await axiosInstance.delete(
      `/api/servers/${server.id}/channels/${channel.id}`,
    );

    await mutate();
  };

  return {
    createChannel,
    editChannel,
    deleteChannel,
  };
};
