"use client";

import { ChatItem, ChatWelcome } from "@/components/chats";
import { useChatQuery } from "@/hooks";
import { MemberWithProfile, MessageWithMemberWithProfile } from "@/models";
import { format } from "date-fns";
import { Loader2, ServerCrash } from "lucide-react";
import { Fragment } from "react";

const DATE_FORMAT = "d MMM yyyy, HH:mm";

interface ChatMessagesProps {
  type: "channel" | "conversation";
  chatId: string;
  name: string;
  member: MemberWithProfile | undefined;
  apiUrl: string;
  paramKey: "channels" | "conversations";
  paramValue: string;
  body: {
    channelId: string;
    serverId: string;
  };
}

export const ChatMessages = ({
  type,
  chatId,
  name,
  member,
  apiUrl,
  paramKey,
  paramValue,
  body,
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
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
              <ChatItem
                key={message.id}
                messageId={message.id}
                currentMember={member}
                member={message.member}
                content={message.content}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                isUpdated={message.updatedAt !== message.createdAt}
                socketUrl="/api/socket"
                paramKey="messages"
                paramValue={message.id}
                body={body}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
};
