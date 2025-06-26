"use client";

import { AvatarOptions } from "@/components/avatar-options";
import { ModeToggle } from "@/components/mode-toggle";
import { NavigationAction, NavigationItem } from "@/components/navigations";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuth, useServers } from "@/hooks";
import { Server } from "@/models";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const NavigationSidebar = () => {
  const router = useRouter();
  const { profile, isLoading: profileLoading } = useAuth();
  const { servers, isLoading: serversLoading } = useServers();

  useEffect(() => {
    if (profileLoading || serversLoading) return;
    if (!profile) {
      router.replace("/");
    }
  }, [profileLoading, serversLoading, profile, router]);

  if (profileLoading || serversLoading)
    return <Loader2 className="animate-spin" />;

  return (
    <div className="text-primary flex h-full w-full flex-col items-center space-y-4 bg-[#E3E5E8] py-3 dark:bg-[#1E1F22]">
      <NavigationAction />
      <Separator className="mx-auto h-[2px] w-10 rounded-md bg-zinc-300 dark:bg-zinc-700" />
      <ScrollArea className="scrollbar-none w-full flex-1 overflow-y-auto">
        {servers?.map((server: Server) => (
          <div key={server.id} className="mb-4">
            <NavigationItem
              id={server.id}
              name={server.name}
              imageUrl={server.imageUrl}
              priorityImageUrl={servers[0].imageUrl}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="mt-auto flex flex-col items-center gap-y-4 pb-3">
        <AvatarOptions profile={profile} />
        <ModeToggle />
      </div>
    </div>
  );
};
