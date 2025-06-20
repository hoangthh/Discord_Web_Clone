"use client";

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
      Channel Id Page
    </div>
  );
};

export default ChannelIdPage;
