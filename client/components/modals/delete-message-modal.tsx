"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDirectMessage, useMessage, useModal } from "@/hooks";
import { useState } from "react";

export const DeleteMessageModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onClose, type, data } = useModal();
  const { deleteMessage } = useMessage();
  const { deleteDirectMessage } = useDirectMessage();

  const isModalOpen = isOpen && type === "deleteMessage";
  const { apiUrl, query } = data;

  const handleConfirm = async () => {
    try {
      setIsLoading(true);

      if (!apiUrl || !query) return;

      if (apiUrl.includes(`/api/socket/messages`)) {
        await deleteMessage({
          apiUrl,
          channelId: query.channelId,
          serverId: query.serverId,
        });
      } else if (apiUrl.includes(`/api/socket/direct-messages`)) {
        await deleteDirectMessage({
          apiUrl,
          conversationId: query.conversationId,
        });
      }

      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Delete Message
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure to do this? <br />
            The message will be permanently deleted
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex w-full items-center justify-between">
            <Button
              disabled={isLoading}
              variant="ghost"
              className="cursor-pointer border-none"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              variant="primary"
              className="cursor-pointer"
              onClick={handleConfirm}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
