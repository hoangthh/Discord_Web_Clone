import { axiosInstance } from "@/api-client";
import { useSocket } from "@/components/providers";
import { useInfiniteQuery } from "@tanstack/react-query";

interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: "channels" | "conversations";
  paramValue: string;
}

export const useChatQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue,
}: ChatQueryProps) => {
  const { isConnected } = useSocket();

  const fetchMessages = async ({ pageParam = undefined }) => {
    try {
      const response = await axiosInstance.get(
        `${apiUrl}/${paramKey}/${paramValue}`,
        {
          params: {
            cursor: pageParam,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: fetchMessages,
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => lastPage?.nextCursor || undefined,
      refetchInterval: isConnected ? false : 1000,
    });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
};
