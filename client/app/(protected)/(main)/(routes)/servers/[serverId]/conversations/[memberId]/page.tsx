"use client";

import { ChatHeader, ChatInput, ChatMessages } from "@/components/chats";
import { MediaRoom } from "@/components/media-room";
import {
  useAuth,
  useConversation,
  useFirstMemberByServerIdIfMember,
} from "@/hooks";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const MemberIdPage = () => {
  const params = useParams<{ memberId: string; serverId: string }>();
  const searchParams = useSearchParams();
  const video = searchParams.get("video");
  const router = useRouter();
  const { profile, isLoading: profileLoading } = useAuth();
  const { member: currentMember, isLoading: memberLoading } =
    useFirstMemberByServerIdIfMember(params.serverId);
  const { conversation, isLoading: conversationLoading } = useConversation(
    currentMember?.id,
    params.memberId,
  );

  const otherMember =
    conversation?.memberOne.profileId === profile?.id
      ? conversation?.memberTwo
      : conversation?.memberOne;

  useEffect(() => {
    if (profileLoading || memberLoading || conversationLoading) return;
    if (!profile) return router.replace("/login");
    if (!currentMember) return router.replace("/");
    if (!conversation) return router.replace(`/servers/${params.serverId}`);
  }, [
    profileLoading,
    memberLoading,
    conversationLoading,
    profile,
    router,
    currentMember,
    conversation,
    params.serverId,
  ]);

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#313338]">
      {otherMember && (
        <>
          <ChatHeader
            serverId={params.serverId}
            name={otherMember?.profile.name}
            type="conversation"
            imageUrl={otherMember?.profile.imageUrl}
          />
          {conversation && (
            <>
              {video && (
                <MediaRoom chatId={conversation.id} audio={true} video={true} />
              )}
              {!video && (
                <>
                  <ChatMessages
                    type="conversation"
                    chatId={conversation?.id}
                    name={otherMember.profile.name}
                    member={currentMember}
                    apiUrl="/api/direct-messages"
                    paramKey="conversations"
                    paramValue={conversation.id}
                    socketUrl="/api/socket/direct-messages"
                    socketQuery={{
                      conversationId: conversation.id,
                    }}
                    socketBody={{
                      conversationId: conversation.id,
                    }}
                  />
                  <ChatInput
                    type="conversation"
                    name={otherMember.profile.name}
                    apiUrl="/api/socket/direct-messages"
                    body={{
                      conversationId: conversation.id,
                    }}
                  />
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MemberIdPage;
