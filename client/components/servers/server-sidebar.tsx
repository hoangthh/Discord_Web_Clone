"use client";

import { useAuth, useServerByServerId } from "@/hooks";
import { Channel, ChannelType, Member, MemberRole } from "@/models";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ServerHeader } from "@/components/servers";

export const ServerSidebar = ({ serverId }: { serverId: string }) => {
  const router = useRouter();
  const { profile, isLoading: profileLoading } = useAuth();
  const {
    server,
    isLoading: serverLoading,
    mutate: mutateServerByServerId,
  } = useServerByServerId(serverId);

  useEffect(() => {
    if (profileLoading || serverLoading) return;
    if (!profile || !server) router.replace("/");
  }, [profile, router, server, profileLoading, serverLoading]);

  if (profileLoading || serverLoading) return null;
  if (!profile || !server) return null;

  const textChannels = server?.channels.filter(
    (channel: Channel) => channel.type === ChannelType.TEXT,
  );
  const audioChannels = server?.channels.filter(
    (channel: Channel) => channel.type === ChannelType.AUDIO,
  );
  const videoChannels = server?.channels.filter(
    (channel: Channel) => channel.type === ChannelType.VIDEO,
  );

  const members = server?.members.filter(
    (member: Member) => member.profileId !== profile?.id,
  );

  const role = server?.members.find(
    (member: Member) => member.profileId === profile?.id,
  )?.role;

  return (
    <div className="text-primary flex h-full w-full flex-col bg-[#F2F3F5] dark:bg-[#2B2D31]">
      {server && (
        <ServerHeader
          server={server}
          mutateServerByServerId={mutateServerByServerId}
          role={role as MemberRole}
        />
      )}
    </div>
  );
};
