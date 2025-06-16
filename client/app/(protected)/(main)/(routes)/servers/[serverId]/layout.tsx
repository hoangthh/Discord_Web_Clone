"use client";

import { ServerSidebar } from "@/components/servers";
import { useAuth, useServerByServerIdIfMember } from "@/hooks";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const ServerIdLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { serverId } = useParams();
  const { profile, isLoading: profileLoading } = useAuth();
  const { server, isLoading: serverLoading } = useServerByServerIdIfMember(
    serverId as string,
  );

  useEffect(() => {
    if (profileLoading || serverLoading) return;

    if (!profile) router.replace("/login");
    if (!server) router.replace("/");
  }, [profile, server, profileLoading, serverLoading, router]);

  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-20 hidden h-full w-60 flex-col md:flex">
        <ServerSidebar serverId={serverId as string} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default ServerIdLayout;
