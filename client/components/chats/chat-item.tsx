"use client";

import { ActionTooltip } from "@/components/action-tooltip";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/user-avatar";
import { useDirectMessage, useMessage, useModal } from "@/hooks";
import { cn } from "@/lib/utils";
import { MemberWithProfile, Role } from "@/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { JSX, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface ChatItemProps {
  content: string;
  member: MemberWithProfile;
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: MemberWithProfile | undefined;
  isUpdated: boolean;
  paramValue: string;
  socketUrl: string;
  socketQuery: {
    channelId?: string;
    serverId?: string;
    conversationId?: string;
  };
  socketBody: {
    channelId?: string;
    serverId?: string;
    conversationId?: string;
  };
}

interface RoleIconMap {
  [key: string]: JSX.Element | null;
}

const roleIconMap: RoleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="ml-2 h-4 w-4 text-indigo-500" />,
  ADMIN: <ShieldAlert className="ml-2 h-4 w-4 text-rose-500" />,
};

const formSchema = z.object({
  content: z.string().min(1),
});

export const ChatItem = ({
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  paramValue,
  socketQuery,
  socketBody,
}: ChatItemProps) => {
  const params = useParams<{ serverId: string }>();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const { onOpen } = useModal();
  const { editMessage } = useMessage();
  const { editDirectMessage } = useDirectMessage();

  const onMemberClick = () => {
    if (!currentMember) return;
    if (member.id === currentMember.id) return;

    router.push(`/servers/${params.serverId}/conversations/${member.id}`);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.keyCode === 27) setIsEditing(false);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!content || content === "") return;

      if (socketUrl === `/api/socket/messages`) {
        await editMessage({
          messageId: paramValue,
          content: values.content,
          channelId: socketBody.channelId,
          serverId: socketBody.serverId,
        });
      } else if (socketUrl === `/api/socket/direct-messages`) {
        await editDirectMessage({
          directMessageId: paramValue,
          content: values.content,
          conversationId: socketBody.conversationId,
        });
      }

      form.reset();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    form.reset({
      content: content,
    });
  }, [form, content]);

  const isAdmin = currentMember?.role === Role.ADMIN;
  const isModerator = currentMember?.role === Role.MODERATOR;
  const isOwner = currentMember?.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isImage = fileUrl;

  return (
    <div className="group relative flex w-full items-center p-4 transition hover:bg-black/5">
      <div className="group flex w-full items-start gap-x-2">
        <div
          className="cursor-pointer transition hover:drop-shadow-md"
          onClick={onMemberClick}
        >
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        <div className="flex w-full flex-col">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p
                className="cursor-pointer text-sm font-semibold hover:underline"
                onClick={onMemberClick}
              >
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role}>
                {roleIconMap[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-secondary relative mt-2 flex aspect-square h-48 w-48 items-center overflow-hidden rounded-md border"
            >
              <Image
                src={fileUrl}
                alt="image-message"
                fill
                className="object-cover"
              />
            </a>
          )}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                "text-sm text-zinc-600 dark:text-zinc-300",
                deleted &&
                  "mt-1 text-xs text-zinc-500 italic dark:text-zinc-400",
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="mx-2 text-[10px] text-zinc-500 dark:text-zinc-400">
                  edited
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                className="flex w-full items-center gap-x-2 pt-2"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            disabled={isLoading}
                            className="border-0 border-none bg-zinc-200/90 p-2 text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75 dark:text-zinc-200"
                            placeholder="Edited Message"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button disabled={isLoading} size="sm" variant="primary">
                  Save
                </Button>
              </form>
              <span className="mt-1 text-[10px] text-zinc-400">
                Press escape to cancel, enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="absolute -top-2 right-5 hidden items-center gap-x-2 rounded-sm border bg-white p-1 group-hover:flex dark:bg-zinc-800">
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <Edit
                onClick={() => setIsEditing(true)}
                className="ml-auto h-4 w-4 cursor-pointer text-zinc-500 transition hover:text-zinc-600 dark:hover:text-zinc-300"
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash
              onClick={() =>
                onOpen("deleteMessage", {
                  apiUrl: `${socketUrl}/${paramValue}`,
                  query: socketQuery,
                })
              }
              className="ml-auto h-4 w-4 cursor-pointer text-zinc-500 transition hover:text-zinc-600 dark:hover:text-zinc-300"
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};
