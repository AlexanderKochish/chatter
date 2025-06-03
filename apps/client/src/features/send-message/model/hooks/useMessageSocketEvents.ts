import { useEffect } from "react";
import { useSocket } from "../../../../shared/socket";
import { Message } from "../../../../shared/types";

export const useMessageSocketEvents = (
  roomId: string,
  eventName: "newMessage" | "updateMessage" | "removeMessage",
  onMessage: (message: Message) => void,
) => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handler = (message: Message) => {
      if (message.roomId === roomId) {
        onMessage(message);
      }
    };

    socket.on(eventName, handler);

    return () => {
      socket.off(eventName, handler);
    };
  }, [roomId, socket, onMessage, eventName]);
};
