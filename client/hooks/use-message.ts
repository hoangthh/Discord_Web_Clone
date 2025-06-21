"use client";

import { axiosInstance } from "@/api-client";

export const useMessage = () => {
  const createMessage = async ({
    content,
    image,
    channelId,
    serverId,
  }: {
    content?: string;
    image?: File | "";
    channelId?: string;
    serverId?: string;
  }) => {
    try {
      if (!channelId || !serverId) return;

      const formData = new FormData();
      formData.append("content", content || "");
      formData.append("channelId", channelId);
      formData.append("serverId", serverId);
      formData.append("image", image || "");

      await axiosInstance.post("/api/socket/messages", formData);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    createMessage,
  };
};
