"use client";

import { CloudUpload, X } from "lucide-react";
import Image from "next/image";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type fileType = "imageUrl" | "image";

interface FileUploadProps {
  onChange: (value?: string | File) => void;
  value: File | string | undefined;
  setFileType?: (type: fileType) => void;
}

export const FileUpload = ({
  onChange,
  value,
  setFileType,
}: FileUploadProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onChange(file);
  };

  const handleFileClear = () => {
    if (setFileType) setFileType("image");
    onChange("");
  };
  console.log("value in file upload: ", value);
  if (value) {
    const imageUrl: string =
      typeof value === "string" ? value : URL.createObjectURL(value);
    return (
      <div className="relative h-30 w-30">
        <Image fill className="rounded-full" src={imageUrl} alt="Upload" />
        <button
          className="absolute top-0 right-0 cursor-pointer rounded-full bg-rose-500 p-1 text-white shadow-sm"
          type="button"
          onClick={handleFileClear}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-50 w-70 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-indigo-500">
      <Label
        htmlFor="picture"
        className="flex cursor-pointer flex-col items-center justify-center"
      >
        <CloudUpload className="h-15 w-15 cursor-pointer text-indigo-500" />
        <p className="text-indigo-500">Choose image for your server</p>
      </Label>
      <Input
        id="picture"
        type="file"
        accept="image/*"
        hidden
        onChange={handleFileChange}
      />
    </div>
  );
};
