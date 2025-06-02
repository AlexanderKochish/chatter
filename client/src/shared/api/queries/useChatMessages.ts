import { useEffect } from "react";
import { getCurrentChat } from "@shared/api";
import { useChatMessagesStore } from "@features/send-message/model/store/chatMessage.store";
import { useMessageSocketEvents } from "@features/send-message/model/hooks/useMessageSocketEvents";

export const useChatMessages = (roomId: string) => {
  const {
    fetchMoreMessages,
    addMessage,
    removeMessage,
    setMessages,
    updateMessage,
  } = useChatMessagesStore();

  const fetchMore = async () => await fetchMoreMessages(roomId);

  useEffect(() => {
    if (roomId) {
      getCurrentChat(roomId).then((res) => {
        setMessages(res?.messages);
      });
    }
  }, [roomId, setMessages]);

  useMessageSocketEvents(roomId, "newMessage", addMessage);
  useMessageSocketEvents(roomId, "updateMessage", updateMessage);
  useMessageSocketEvents(roomId, "removeMessage", removeMessage);

  return {
    setMessages,
    fetchMore,
  };
};
