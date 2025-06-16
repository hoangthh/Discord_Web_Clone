"use client";

import { InitialModal } from "@/components/modals";
import { useServer } from "@/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SetupPage = () => {
  const router = useRouter();
  const { server, serverIsLoading } = useServer();

  useEffect(() => {
    if (server) router.replace(`/servers/${server.id}`);
  }, [router, server]);

  if (serverIsLoading) return <div>Loading...</div>;

  return (
    <div>
      <InitialModal />
    </div>
  );
};

export default SetupPage;
