"use client";

import { ChatItem, ChatWelcome } from "@/components/chats";
import { useChatQuery, useChatScroll, useChatSocket } from "@/hooks";
import { MemberWithProfile, MessageWithMemberWithProfile } from "@/models";
import { format } from "date-fns";
import { Loader2, ServerCrash } from "lucide-react";
import { Fragment, useRef, ComponentRef } from "react";

const DATE_FORMAT = "d MMM yyyy, HH:mm";

interface ChatMessagesProps {
  type: "channel" | "conversation";
  chatId: string;
  name: string;
  member: MemberWithProfile | undefined;
  apiUrl: string;
  paramKey: "channels" | "conversations";
  paramValue: string;
  socketUrl: string;
  socketQuery: {
    channelId?: string;
    serverId?: string;
    conversationId?: string;
  };
  socketBody: {
    channelId?: string;
    serverId?: string;
    conversationId?: string;
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
  socketUrl,
  socketQuery,
  socketBody,
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  const chatRef = useRef<ComponentRef<"div">>(null);
  const bottomRef = useRef<ComponentRef<"div">>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });
  useChatSocket({ queryKey, addKey, updateKey });
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages[0].items.length ?? 0,
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
    <div ref={chatRef} className="flex flex-1 flex-col overflow-y-auto py-4">
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && <ChatWelcome type={type} name={name} />}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="my-4 h-6 w-6 animate-spin text-zinc-500" />
          ) : (
            <button
              className="my-4 cursor-pointer text-xs text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
              onClick={() => fetchNextPage()}
            >
              Load previous messages
            </button>
          )}
        </div>
      )}
      <div className="mt-auto flex flex-col-reverse">
        {data?.pages?.map((group, index) => (
          <Fragment key={index}>
            {group.items.map((message: MessageWithMemberWithProfile) => (
              <ChatItem
                key={message.id}
                currentMember={member}
                member={message.member}
                content={message.content}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                isUpdated={message.updatedAt !== message.createdAt}
                socketUrl={socketUrl}
                paramValue={message.id}
                socketQuery={socketQuery}
                socketBody={socketBody}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};
