"use client";

import { InitialModal } from "@/components/modals";
import { useAuth, useServerByProfileId } from "@/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SetupPage = () => {
  const router = useRouter();
  const { profile } = useAuth();
  const { server } = useServerByProfileId(profile?.id);

  useEffect(() => {
    if (server) router.replace(`/servers/${server.id}`);
  }, [router, server]);

  return (
    <div>
      <InitialModal />
    </div>
  );
};

export default SetupPage;
