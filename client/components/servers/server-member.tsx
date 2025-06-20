"use client";

import { cn } from "@/lib/utils";
import { MemberWithProfile, Role } from "@/models";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { UserAvatar } from "@/components/user-avatar";

interface ServerMemberProps {
  member: MemberWithProfile;
  server: Server;
}

const roleIconMap = {
  [Role.GUEST]: null,
  [Role.MODERATOR]: <ShieldCheck className="ml-2 h-4 w-4 text-indigo-500" />,
  [Role.ADMIN]: <ShieldAlert className="ml-2 h-4 w-4 text-rose-500" />,
};

export const ServerMember = ({ member, server }: ServerMemberProps) => {
  const params = useParams<{ memberId: string; serverId: string }>();
  const router = useRouter();

  const icon = roleIconMap[member.role];

  const handleClick = () => {
    router.push(`/servers/${params.serverId}/conversations/${member.id}`);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "group mb-1 flex w-full cursor-pointer items-center gap-x-2 rounded-md px-2 py-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50",
        params.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700",
      )}
    >
      <UserAvatar
        src={member.profile.imageUrl}
        className="h-8 w-8 md:h-8 md:w-8"
      />
      <p
        className={cn(
          "text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300",
          params.memberId === member.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white",
        )}
      >
        {member.profile.name}
      </p>
      {icon}
    </button>
  );
};
