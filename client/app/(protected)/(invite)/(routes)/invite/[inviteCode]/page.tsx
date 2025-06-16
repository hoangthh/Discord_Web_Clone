"use client";

import { useAuth, useServerByInviteCodeIfMember, useServers } from "@/hooks";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

type Params = {
  inviteCode: string;
};

const InviteCodePage = () => {
  const { profile, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams<Params>();
  const { joinServer } = useServers();
  const hasJoinedRef = useRef(false);

  const { server: existingServer } = useServerByInviteCodeIfMember(
    params.inviteCode,
  );

  useEffect(() => {
    if (isLoading) return;
    if (!profile) return router.replace("/login");
    if (!params.inviteCode) return router.replace("/");
    if (existingServer) {
      return router.replace(`/servers/${existingServer.id}`);
    }

    if (existingServer !== undefined && !hasJoinedRef.current) {
      hasJoinedRef.current = true;

      (async () => {
        const server = await joinServer({
          inviteCode: params.inviteCode,
          profileId: profile.id,
        });
        if (server) router.replace(`/servers/${server.id}`);
      })();
    }
  }, [
    isLoading,
    profile,
    router,
    params.inviteCode,
    existingServer,
    joinServer,
  ]);

  return null;
};

export default InviteCodePage;
