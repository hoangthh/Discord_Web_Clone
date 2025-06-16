"use client";

import { InitialModal } from "@/components/modals";
import { useAuth, useServerByProfileId } from "@/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SetupPage = () => {
  const router = useRouter();
  const { profile, isLoading: profileLoading } = useAuth();
  const { server, isLoading: serverLoading } = useServerByProfileId(
    profile?.id || "",
  );

  useEffect(() => {
    if (server) router.replace(`/servers/${server.id}`);
  }, [router, server]);

  if (profileLoading || serverLoading || server) return;

  return (
    <div>
      <InitialModal />
    </div>
  );
};

export default SetupPage;
