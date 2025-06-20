"use client";

import { useAuth } from "@/hooks";
import { useGeneralChannelServerByServerId } from "@/hooks/use-general-channel-server-by-server-id";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const ServerIdPage = () => {
  const params = useParams<{ serverId: string }>();
  const router = useRouter();
  const { profile } = useAuth();
  const { server } = useGeneralChannelServerByServerId(params.serverId);

  const initialChannel = server?.channels[0];

  useEffect(() => {
    if (!profile) router.replace("/login");
    if (initialChannel)
      router.replace(
        `/servers/${params.serverId}/channels/${initialChannel.id}`,
      );
  }, [profile, router, initialChannel, params.serverId]);

  if (initialChannel?.name !== "general") return null;

  return <Loader2 className="animate-spin" />;
};

export default ServerIdPage;
