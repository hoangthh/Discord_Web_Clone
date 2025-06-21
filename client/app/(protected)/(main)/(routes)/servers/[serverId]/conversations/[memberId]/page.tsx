"use client";

import { ChatHeader } from "@/components/chats";
import {
  useAuth,
  useConversation,
  useFirstMemberByServerIdIfMember,
} from "@/hooks";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const MemberIdPage = () => {
  const params = useParams<{ memberId: string; serverId: string }>();
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
        <ChatHeader
          serverId={params.serverId}
          name={otherMember?.profile.name}
          type="conversation"
          imageUrl={otherMember?.profile.imageUrl}
        />
      )}
    </div>
  );
};

export default MemberIdPage;
