"use client";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Smile } from "lucide-react";
import { useTheme } from "next-themes";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface EmojiPickerProps {
  onChange: (value: string) => void;
}

const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
  const { resolvedTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger>
        <Smile className="cursor-pointer text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300" />
      </PopoverTrigger>
      <PopoverContent
        side="right"
        sideOffset={40}
        className="mb-16 border-none bg-transparent shadow-none drop-shadow-none"
      >
        <Picker
          theme={resolvedTheme}
          data={data}
          onEmojiSelect={(emoji: { native: string }) => onChange(emoji.native)}
        />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
