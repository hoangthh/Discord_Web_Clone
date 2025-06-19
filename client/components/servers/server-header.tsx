"use client";

import { MemberRole, Role, ServerWithChannelWithMember } from "@/models";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from "lucide-react";
import { useModal } from "@/hooks";
import { KeyedMutator } from "swr";

interface ServerHeaderProps {
  server: ServerWithChannelWithMember;
  mutateServerByServerId: KeyedMutator<ServerWithChannelWithMember>;
  role?: MemberRole;
}

export const ServerHeader = ({
  server,
  role,
  mutateServerByServerId,
}: ServerHeaderProps) => {
  const { onOpen } = useModal();

  const isAdmin = role === Role.ADMIN;
  const isModerator = isAdmin || role === Role.MODERATOR;
  const isGuest = role === Role.GUEST;

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none" asChild>
          <button className="text-md flex h-12 w-full cursor-pointer items-center border-b-2 border-neutral-200 px-3 font-semibold transition hover:bg-zinc-700/10 dark:border-neutral-800 dark:hover:bg-zinc-700/50">
            {server.name}
            <ChevronDown className="ml-auto h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 space-y-[2px] text-xs font-medium text-black dark:text-neutral-400">
          {isModerator && (
            <DropdownMenuItem
              onClick={() => onOpen("invite", { server })}
              className="cursor-pointer px-3 py-2 text-sm text-indigo-600 dark:text-indigo-400"
            >
              Invite People
              <UserPlus className="ml-auto h-4 w-4" />
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <DropdownMenuItem
              onClick={() =>
                onOpen("editServer", { server, mutateServerByServerId })
              }
              className="cursor-pointer px-3 py-2 text-sm"
            >
              Server Settings
              <Settings className="ml-auto h-4 w-4" />
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <DropdownMenuItem
              onClick={() => onOpen("members", { server })}
              className="cursor-pointer px-3 py-2 text-sm"
            >
              Manage Members
              <Users className="ml-auto h-4 w-4" />
            </DropdownMenuItem>
          )}
          {isModerator && (
            <DropdownMenuItem
              onClick={() => onOpen("createChannel")}
              className="cursor-pointer px-3 py-2 text-sm"
            >
              Create Channel
              <PlusCircle className="ml-auto h-4 w-4" />
            </DropdownMenuItem>
          )}
          {isModerator && <DropdownMenuSeparator />}
          {isAdmin && (
            <DropdownMenuItem className="cursor-pointer px-3 py-2 text-sm text-rose-500">
              Delete Server
              <Trash className="ml-auto h-4 w-4" />
            </DropdownMenuItem>
          )}
          {!isAdmin && (
            <DropdownMenuItem className="cursor-pointer px-3 py-2 text-sm text-rose-500">
              Leave Server
              <LogOut className="ml-auto h-4 w-4" />
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
