"use client";

import { useModal } from "@/hooks";
import {
  ChannelTypeEnum,
  MemberRole,
  Role,
  ServerWithChannelWithMember,
} from "@/models";
import { Plus, Settings } from "lucide-react";
import { ActionTooltip } from "../action-tooltip";

interface ServerSectionProps {
  label: string;
  role?: MemberRole | string;
  sectionType: "channels" | "members";
  channelType?: ChannelTypeEnum | string;
  server?: ServerWithChannelWithMember;
}

export const ServerSection = ({
  label,
  role,
  sectionType,
  channelType,
  server,
}: ServerSectionProps) => {
  const { onOpen } = useModal();

  return (
    <div className="flex items-center justify-between py-2">
      <p className="dark:text-zin-400 text-xs font-semibold text-zinc-500 uppercase">
        {label}
      </p>
      {role !== Role.GUEST && sectionType === "channels" && (
        <ActionTooltip label="Create Channel" side="top">
          <button
            onClick={() => onOpen("createChannel", { channelType })}
            className="cursor-pointer text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
          >
            <Plus className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
      {role === Role.ADMIN && sectionType === "members" && (
        <ActionTooltip label="Manage Members" side="top">
          <button
            onClick={() => onOpen("members", { server })}
            className="cursor-pointer text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
          >
            <Settings className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};
