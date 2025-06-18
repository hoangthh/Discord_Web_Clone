"use client";

import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { useModal, useServers } from "@/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z
  .object({
    name: z.string().min(1, {
      message: "Server name is required",
    }),
    image: z.instanceof(File),
    imageUrl: z.string(),
  })
  .refine(
    (data) => {
      return data.image instanceof File || data.imageUrl.length > 0;
    },
    {
      message: "Server image is required",
      path: ["imageUrl"],
    },
  );

export const EditServerModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { editServer } = useServers();
  const router = useRouter();
  const [fileType, setFileType] = useState<"image" | "imageUrl">("imageUrl");

  const isModalOpen = isOpen && type === "editServer";
  const { server, mutateServerByServerId } = data;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      image: undefined,
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (!isModalOpen || !server) return;

    form.reset({
      name: server.name,
      imageUrl: server.imageUrl,
      image: undefined,
    });
    setFileType("imageUrl");
  }, [isModalOpen, form, server]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (server) {
      await editServer({
        serverId: server.id,
        name: values.name,
        image: values.image,
      });
    }

    if (mutateServerByServerId) await mutateServerByServerId();

    form.reset();
    router.refresh();
    onClose();
  };

  const handleClose = () => {
    setFileType("imageUrl");
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name={fileType === "imageUrl" ? "imageUrl" : "image"}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          value={field.value}
                          onChange={field.onChange}
                          setFileType={setFileType}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-secondary/70 text-xs font-bold text-zinc-500 uppercase">
                      Server Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Enter a server name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button
                className="cursor-pointer"
                variant={"primary"}
                disabled={isLoading}
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
