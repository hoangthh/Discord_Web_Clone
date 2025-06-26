"use client";

import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useServers } from "@/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const customServerFormSchema = z.object({
  name: z.string().min(1, {
    message: "Server name is required",
  }),
  image: z.union([
    z.instanceof(File, { message: "A valid image file is required" }),
    z.literal("").refine(() => false, {
      message: "Image is required",
    }),
  ]),
});

const joinServerFormSchema = z.object({
  inviteLink: z.string().min(1, {
    message: "Invite link is required",
  }),
});

export const InitialModal = () => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { createServer } = useServers();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const customServerForm = useForm({
    resolver: zodResolver(customServerFormSchema),
    defaultValues: {
      name: "",
      image: "",
    },
  });

  const joinServerForm = useForm({
    resolver: zodResolver(joinServerFormSchema),
    defaultValues: {
      inviteLink: "",
    },
  });

  const customServerIsLoading = customServerForm.formState.isSubmitting;
  const joinServerIsLoading = customServerForm.formState.isSubmitting;

  const customServerOnSubmit = async (
    values: z.infer<typeof customServerFormSchema>,
  ) => {
    await createServer({ name: values.name, image: values.image });

    customServerForm.reset();
    router.refresh();
    window.location.reload();
  };

  const joinServerOnSubmit = async (
    values: z.infer<typeof joinServerFormSchema>,
  ) => {
    router.push(values.inviteLink);
  };

  if (!isMounted) return null;

  return (
    <Dialog open>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Customize your server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your server a personality with a name and an image. You can
            always change it later
          </DialogDescription>
        </DialogHeader>
        <Form {...customServerForm}>
          <form
            onSubmit={customServerForm.handleSubmit(customServerOnSubmit)}
            className="space-y-8"
          >
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={customServerForm.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={customServerForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-secondary/70 text-xs font-bold text-zinc-500 uppercase">
                      Server Name
                    </FormLabel>
                    <div className="flex select-none">
                      <FormControl>
                        <Input
                          disabled={customServerIsLoading}
                          className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
                          placeholder="Enter a server name"
                          {...field}
                        />
                      </FormControl>
                      <Button
                        className="cursor-pointer"
                        variant={"primary"}
                        disabled={customServerIsLoading}
                      >
                        Create
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>

        <Form {...joinServerForm}>
          <form onSubmit={joinServerForm.handleSubmit(joinServerOnSubmit)}>
            <div className="bg-gray-100 px-6 py-4">
              <FormField
                control={joinServerForm.control}
                name="inviteLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-secondary/70 text-xs font-bold text-zinc-500 uppercase">
                      Or Join Other Server By Invite Link
                    </FormLabel>
                    <div className="flex select-none">
                      <FormControl>
                        <Input
                          disabled={joinServerIsLoading}
                          className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
                          placeholder="Enter a server invite link"
                          {...field}
                        />
                      </FormControl>
                      <Button
                        className="cursor-pointer"
                        disabled={joinServerIsLoading}
                      >
                        Join
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
