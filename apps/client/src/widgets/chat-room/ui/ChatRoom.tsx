import { useEffect, useRef } from "react";
import MessageList from "@features/send-message/ui/MessageList/MessageList";
import { useSearchQuery } from "@shared/hooks/useSearchQuery";

type Props = {
  roomClass: string;
};

const ChatRoom = ({ roomClass }: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { param } = useSearchQuery("chatId");

  useEffect(() => {
    if (ref.current && param) {
      ref.current.scrollTo({
        top: ref.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [param]);

  return (
    <div className={roomClass} ref={ref}>
      <MessageList />
    </div>
  );
};

export default ChatRoom;
