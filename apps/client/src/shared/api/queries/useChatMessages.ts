import { useInfiniteQuery, useQueryClient, InfiniteData } from "@tanstack/react-query";
import { getCurrentChat } from "@shared/api";
import { ChatPage, Message } from "@shared/types";
import { useMessageSocketEvents } from "@features/send-message/model/hooks/useMessageSocketEvents";

export const useChatMessages = (roomId: string) => {
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    ...rest
  } = useInfiniteQuery<ChatPage, Error>({
    queryKey: ["chatMessages", roomId],
    queryFn: ({ pageParam }) => getCurrentChat(roomId, pageParam as string),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined,
    enabled: !!roomId,
  });

  const messages = data?.pages.flatMap((page) => page.messages) || [];

  useMessageSocketEvents(roomId, "newMessage", (newMessage) => {
    queryClient.setQueryData<InfiniteData<ChatPage>>(["chatMessages", roomId], (oldData) => {
      if (!oldData) return oldData;

      const exists = oldData.pages[0].messages.some(
        (msg: Message) => msg.id === newMessage.id
      );
      if (exists) return oldData;

      return {
        ...oldData,
        pages: [
          {
            ...oldData.pages[0],
            messages: [newMessage, ...oldData.pages[0].messages],
          },
          ...oldData.pages.slice(1),
        ],
      };
    });
  });

  useMessageSocketEvents(roomId, "updateMessage", (updatedMessage) => {
    queryClient.setQueryData<InfiniteData<ChatPage>>(["chatMessages", roomId], (oldData) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          messages: page.messages.map((msg: Message) =>
            msg.id === updatedMessage.id ? updatedMessage : msg
          ),
        })),
      };
    });
  });

  useMessageSocketEvents(roomId, "removeMessage", (removedMessage) => {
    queryClient.setQueryData<InfiniteData<ChatPage>>(["chatMessages", roomId], (oldData) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          messages: page.messages.filter(
            (msg: Message) => msg.id !== removedMessage.id
          ),
        })),
      };
    });
  });

  console.log('chatMessage hook', hasNextPage, fetchNextPage, isFetchingNextPage)
  return {
    messages,
    hasMore: hasNextPage,
    fetchMore: fetchNextPage,
    loading: isFetchingNextPage || isFetching,
    ...rest,
  };
};
