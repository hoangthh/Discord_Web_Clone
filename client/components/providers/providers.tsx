"use client";

import { axiosInstance } from "@/api-client";
import { SWRConfig } from "swr";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: (url) => axiosInstance.get(url).then((res) => res.data),
        shouldRetryOnError: false,
      }}
    >
      {children}
    </SWRConfig>
  );
}
