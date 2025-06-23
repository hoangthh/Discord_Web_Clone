"use client";

import { axiosInstance } from "@/api-client";

export const useDirectMessage = () => {
  const createDirectMessage = async ({
    content,
    image,
    conversationId,
  }: {
    content?: string;
    image?: File | "";
    conversationId?: string;
  }) => {
    try {
      if (!conversationId) return;

      const formData = new FormData();
      formData.append("content", content || "");
      formData.append("conversationId", conversationId);
      formData.append("image", image || "");

      await axiosInstance.post("/api/socket/direct-messages", formData);
    } catch (error) {
      console.log(error);
    }
  };

  const editDirectMessage = async ({
    directMessageId,
    content,
    conversationId,
  }: {
    directMessageId: string;
    content: string;
    conversationId?: string;
  }) => {
    if (content === "" || !conversationId) return;
    try {
      await axiosInstance.patch(
        `/api/socket/direct-messages/${directMessageId}`,
        {
          content,
          conversationId,
        },
      );
    } catch (error) {
      console.log(error);
    }
  };

  const deleteDirectMessage = async ({
    apiUrl,
    conversationId,
  }: {
    apiUrl: string;
    conversationId?: string;
  }) => {
    if (!conversationId) return;

    try {
      await axiosInstance.delete(`${apiUrl}`, {
        params: {
          conversationId,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    createDirectMessage,
    editDirectMessage,
    deleteDirectMessage,
  };
};
