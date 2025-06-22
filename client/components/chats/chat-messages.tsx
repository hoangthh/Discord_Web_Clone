"use client";

import { Member, MemberWithProfile } from "@/models";
import { ChatWelcome } from "@/components/chats";

interface ChatMessagesProps {
  name: string;
  member: MemberWithProfile | undefined;
  chatId: string;
  body: {
    channelId: string;
    serverId: string;
  };
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

export const ChatMessages = ({
  name,
  member,
  chatId,
  body,
  paramKey,
  paramValue,
  type,
}: ChatMessagesProps) => {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto py-4">
      <div className="flex-1">
        <ChatWelcome type={type} name={name} />
      </div>
    </div>
  );
};
