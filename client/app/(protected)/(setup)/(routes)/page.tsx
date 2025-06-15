"use client";

import { InitialModal } from "@/components/modals";
import { useServer } from "@/hooks";
import { useRouter } from "next/navigation";

const SetupPage = () => {
  const router = useRouter();
  const { server } = useServer();

  if (server) router.replace(`/servers/${server.id}`);

  return (
    <div>
      <InitialModal />
    </div>
  );
};

export default SetupPage;
