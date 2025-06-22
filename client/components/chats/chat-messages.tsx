"use client";

import {
  Member,
  MemberWithProfile,
  MessageWithMemberWithProfile,
} from "@/models";
import { ChatWelcome } from "@/components/chats";
import { useChatQuery } from "@/hooks";
import { Loader2, ServerCrash } from "lucide-react";
import { Fragment } from "react";

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
  const queryKey = `chat:${chatId}`;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      paramKey,
      paramValue,
    });

  if (status === "pending") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <Loader2 className="my-4 h-7 w-7 animate-spin text-zinc-500" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <ServerCrash className="my-4 h-7 w-7 text-zinc-500" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto py-4">
      <div className="flex-1">
        <ChatWelcome type={type} name={name} />
      </div>
      <div className="mt-auto flex flex-col-reverse">
        {data?.pages?.map((group, index) => (
          <Fragment key={index}>
            {group.items.map((message: MessageWithMemberWithProfile) => (
              <div key={message?.id}>{message.content}</div>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
};
