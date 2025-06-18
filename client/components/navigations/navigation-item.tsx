"use client";

import { ActionTooltip } from "@/components/action-tooltip";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

interface NavigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
  priorityImageUrl: string;
}

export const NavigationItem = ({
  id,
  imageUrl,
  name,
  priorityImageUrl,
}: NavigationItemProps) => {
  const params = useParams();
  const router = useRouter();

  const onClick = () => {
    router.push(`/servers/${id}`);
  };

  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button
        onClick={onClick}
        className="group relative flex cursor-pointer items-center"
      >
        <div
          className={cn(
            "bg-primary absolute left-0 w-[4px] rounded-r-full transition-all",
            params?.serverId !== id && "group-hover:h-[20px]",
            params?.serverId === id ? "h-[36px]" : "h-[8px]",
          )}
        />
        <div
          className={cn(
            "group group:hover:rounded-[16px] relative mx-3 flex h-[48px] w-[48px] overflow-hidden rounded-[24px] transition-all",
            params?.serverId === id &&
              "bg-primary/10 text-primary rounded-[16px]",
          )}
        >
          <Image
            fill
            priority={priorityImageUrl === imageUrl}
            src={imageUrl}
            alt="Channel"
          />
        </div>
      </button>
    </ActionTooltip>
  );
};
