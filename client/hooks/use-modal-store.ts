import {
  Channel,
  ChannelTypeEnum,
  Server,
  ServerWithChannelWithMember,
} from "@/models";
import { KeyedMutator } from "swr";
import { create } from "zustand";

export type ModalType =
  | "createServer"
  | "invite"
  | "editServer"
  | "members"
  | "createChannel"
  | "leaveServer"
  | "deleteServer"
  | "deleteChannel"
  | "editChannel"
  | "messageFile"
  | "deleteMessage";

interface ModalData {
  server?: Server;
  channel?: Channel;
  channelType?: ChannelTypeEnum | string;
  apiUrl?: string;
  query?: {
    channelId?: string;
    serverId?: string;
    conversationId?: string;
  };
  body?: {
    channelId?: string;
    serverId?: string;
    conversationId?: string;
  };
  mutateServerByServerId?: KeyedMutator<ServerWithChannelWithMember>;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
