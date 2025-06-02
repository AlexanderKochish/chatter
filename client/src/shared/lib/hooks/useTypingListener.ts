import { useProfile } from "@/shared/api/queries/useProfile";
import { useSearchQuery } from "@/shared/hooks/useSearchQuery";
import { useSocket } from "@/shared/socket";
import { useEffect, useRef, useState } from "react";

export const useTypingListener = () => {
  const { param: roomId } = useSearchQuery("chatId");
  const { me: currentUser } = useProfile();
  const socket = useSocket();
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleTyping = ({ userId }: { userId: string }) => {
      if (userId !== currentUser.id) {
        setIsTyping(true);

        if (typingTimeout.current) clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    };

    socket?.on("userTyping", handleTyping);

    return () => {
      socket?.off("userTyping", handleTyping);
    };
  }, [socket, roomId, currentUser.id]);

  useEffect(() => {
    return () => {
      setIsTyping(false);
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    };
  }, [roomId]);

  return { isTyping };
};
