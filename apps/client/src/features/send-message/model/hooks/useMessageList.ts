import { useEffect } from "react";
import { useChatMessages } from "@shared/api/queries/useChatMessages";
import { useSearchQuery } from "@shared/hooks/useSearchQuery";
import { useIntersectionObserver } from "@shared/hooks/useIntersectionObserver";

export const useMessageList = () => {
  const { param: roomId } = useSearchQuery("chatId");
  const { fetchMore, isLoading, hasMore } = useChatMessages(roomId);

  console.log(isLoading, hasMore)
  const { containerRef, loaderRef } = useIntersectionObserver({
    hasMore,
    loading: isLoading,
    fetchMore
  });

  useEffect(() => {
    if (!roomId) return;
  }, [roomId]);

  return {
    containerRef,
    loaderRef,
    roomId,
  };
};
