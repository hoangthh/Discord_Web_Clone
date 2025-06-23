"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ActionTooltip } from "../action-tooltip";
import { Video, VideoOff } from "lucide-react";

export const ChatVideoButton = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isVideo = searchParams.get("video");

  const Icon = isVideo ? VideoOff : Video;
  const tooltipLabel = isVideo ? "End video call" : "Start video call";

  const onClick = () => {
    if (isVideo) router.push(pathname);
    else router.push(`${pathname}?video=true`);
  };

  return (
    <ActionTooltip side="bottom" label={tooltipLabel}>
      <button
        className="mr-4 cursor-pointer transition hover:opacity-75"
        onClick={onClick}
      >
        <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
      </button>
    </ActionTooltip>
  );
};
