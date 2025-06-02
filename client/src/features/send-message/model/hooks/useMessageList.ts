import { useEffect } from "react";
import { useChatMessages } from "../../../../shared/api/queries/useChatMessages";
import { useSearchQuery } from "../../../../shared/hooks/useSearchQuery";
import { useIntersectionObserver } from "../../../../shared/hooks/useIntersectionObserver";
import { useChatMessagesStore } from "../store/chatMessage.store";

export const useMessageList = () => {
  const { param: roomId } = useSearchQuery("chatId");
  const { hasMore, loading, setCursor, setHasMore } = useChatMessagesStore();
  const { setMessages, fetchMore } = useChatMessages(roomId);

  const { containerRef, loaderRef } = useIntersectionObserver({
    hasMore,
    loading,
    fetchMore,
  });

  useEffect(() => {
    if (!roomId) return;
    setMessages([]);
    setCursor(null);
    setHasMore(true);
  }, [roomId]);

  return {
    containerRef,
    loaderRef,
    roomId,
  };
};
