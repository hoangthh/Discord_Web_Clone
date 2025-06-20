"use client";

import { useAuth, useServers } from "@/hooks";
import { useRouter } from "next/navigation";

import { ModeToggle } from "@/components/mode-toggle";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { NavigationAction } from "./navigation-action";
import { NavigationItem } from "./navigation-item";
import { useEffect } from "react";

export const NavigationSidebar = () => {
  const { profile } = useAuth();
  const { servers } = useServers();
  const router = useRouter();

  useEffect(() => {
    if (!profile) {
      router.replace("/");
    }
  }, [profile, router]);
  return (
    <div className="text-primary flex h-full w-full flex-col items-center space-y-4 bg-[#E3E5E8] py-3 dark:bg-[#1E1F22]">
      <NavigationAction />
      <Separator className="mx-auto h-[2px] w-10 rounded-md bg-zinc-300 dark:bg-zinc-700" />
      <ScrollArea className="scrollbar-none w-full flex-1 overflow-y-auto">
        {servers?.map(
          (server: { id: string; name: string; imageUrl: string }) => (
            <div key={server.id} className="mb-4">
              <NavigationItem
                id={server.id}
                name={server.name}
                imageUrl={server.imageUrl}
                priorityImageUrl={servers[0].imageUrl}
              />
            </div>
          ),
        )}
      </ScrollArea>
      <div className="mt-auto flex flex-col items-center gap-y-4 pb-3">
        <ModeToggle />
      </div>
    </div>
  );
};
