"use client";

import { useAuth } from "@/hooks";
import { useServerWithGeneralChannelByServerId } from "@/hooks";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const ServerIdPage = () => {
  const params = useParams<{ serverId: string }>();
  const router = useRouter();
  const { profile, isLoading: profileLoading } = useAuth();
  const { server, isLoading: serverLoading } =
    useServerWithGeneralChannelByServerId(params.serverId);

  const initialChannel = server?.channels[0];

  useEffect(() => {
    if (profileLoading || serverLoading) return;
    if (!profile) return router.replace("/login");
    if (initialChannel)
      return router.replace(
        `/servers/${params.serverId}/channels/${initialChannel.id}`,
      );
  }, [
    profileLoading,
    serverLoading,
    profile,
    router,
    initialChannel,
    params.serverId,
  ]);

  if (initialChannel?.name !== "general") return null;

  return <Loader2 className="animate-spin" />;
};

export default ServerIdPage;
