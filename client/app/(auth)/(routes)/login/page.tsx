"use client";

import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog";
import Image from "next/image";

const LoginPage = () => {
  const handleLoginGoogle = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`;
  };

  return (
    <div className="relative flex h-screen w-screen items-center justify-center">
      <div className="absolute z-[-1] h-full w-full">
        <Image fill src={"/login-background.webp"} alt="background" />
      </div>

      <div className="absolute top-10 left-10 flex h-7 w-7 items-center gap-2">
        <Image
          width={"100"}
          height={"100"}
          src={"/discord-logo.png"}
          alt="logo"
        />
        <span className="text-lg font-bold">Discord</span>
      </div>

      <Dialog open>
        <DialogContent className="overflow-hidden rounded-xl bg-[#313338] p-0 text-white md:min-w-2xl">
          <DialogHeader className="px-6 pt-8">
            <DialogTitle className="text-center text-2xl font-bold">
              Login to Discord
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
              Welcome back My User! It is such a pleasure to see you again
            </DialogDescription>
          </DialogHeader>

          <Button
            className="m-auto mt-4 ml-5 cursor-pointer bg-white text-black hover:text-white"
            variant={"primary"}
            onClick={handleLoginGoogle}
          >
            <Image
              width={20}
              height={20}
              src={"/google-logo.png"}
              alt="google"
            />
            Login with Google
          </Button>

          <DialogFooter className="px-6 py-4 text-sm">
            <Button className="cursor-pointer" variant={"link"}>
              <Image
                width={20}
                height="20"
                src="/discord-logo.png"
                alt="discord"
              />
              <a href="https://github.com/hoangthh/Discord_Web_Clone">
                Visit my Github
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoginPage;
