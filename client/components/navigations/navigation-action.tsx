"use client";

import { ActionTooltip } from "@/components/action-tooltip";
import { useModal } from "@/hooks";
import { Plus } from "lucide-react";

export const NavigationAction = () => {
  const { onOpen } = useModal();

  return (
    <div>
      <ActionTooltip side="right" align="center" label="Add a server">
        <button
          className="group flex cursor-pointer items-center"
          onClick={() => onOpen("createServer")}
        >
          <div className="bg-background mx-3 flex h-[48px] w-[48px] items-center justify-center overflow-hidden rounded-[24px] transition-colors group-hover:rounded-[16px] group-hover:bg-emerald-500 dark:bg-neutral-700">
            <Plus
              className="text-emerald-500 transition group-hover:text-white"
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};
