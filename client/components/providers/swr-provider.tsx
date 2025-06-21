"use client";

import { axiosInstance } from "@/api-client";
import { SWRConfig } from "swr";

const MILISECOND_PER_HOUR = 60 * 60 * 1000;

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: (url) => axiosInstance.get(url).then((res) => res.data),
        dedupingInterval: MILISECOND_PER_HOUR,
        revalidateOnFocus: false,
        shouldRetryOnError: false,
      }}
    >
      {children}
    </SWRConfig>
  );
}
