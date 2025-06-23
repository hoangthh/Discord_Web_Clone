"use client";

import { ChatHeader, ChatInput, ChatMessages } from "@/components/chats";
import {
  useAuth,
  useChannelByChannelId,
  useFirstMemberByServerIdIfMember,
} from "@/hooks";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const ChannelIdPage = () => {
  const params = useParams<{ serverId: string; channelId: string }>();
  const router = useRouter();
  const { profile, isLoading: profileLoading } = useAuth();
  const { channel, isLoading: channelLoading } = useChannelByChannelId(
    params.channelId,
  );
  const { member, isLoading: memberLoading } = useFirstMemberByServerIdIfMember(
    params.serverId,
  );

  useEffect(() => {
    if (profileLoading || channelLoading || memberLoading) return;
    if (!profile) return router.replace("/login");
    if (!channel || !member) return router.replace("/");
  }, [
    profileLoading,
    channelLoading,
    memberLoading,
    profile,
    router,
    channel,
    member,
  ]);

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#313338]">
      {channel && (
        <>
          <ChatHeader
            type="channel"
            serverId={channel?.serverId}
            name={channel?.name}
          />
          <ChatMessages
            type="channel"
            chatId={channel.id}
            name={channel.name}
            member={member}
            apiUrl="/api/messages"
            paramKey="channels"
            paramValue={channel.id}
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            socketBody={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
          />
          <ChatInput
            type="channel"
            name={channel.name}
            apiUrl="/api/socket/messages"
            body={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
          />
        </>
      )}
    </div>
  );
};

export default ChannelIdPage;
