import { useEffect } from "react";
import { useChatMessages } from "@shared/api/queries/useChatMessages";
import { useSearchQuery } from "@shared/hooks/useSearchQuery";
import { useIntersectionObserver } from "@shared/hooks/useIntersectionObserver";

export const useMessageList = () => {
  const { param: roomId } = useSearchQuery("chatId");
  const { fetchMore, loading, hasMore } = useChatMessages(roomId);

  const { containerRef, loaderRef } = useIntersectionObserver({
    hasMore,
    loading,
    fetchMore,
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
