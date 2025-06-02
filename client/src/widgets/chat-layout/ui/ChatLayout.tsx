import s from "./ChatLayout.module.css";
import clsx from "clsx";
import MessageHeader from "@widgets/chat-header/ui/message-header/MessageHeader";
import ChatSidebar from "@widgets/chat-sidebar/ui/ChatSidebar";
import ChatRoom from "@widgets/chat-room/ui/ChatRoom";
import { useChatLayoutLogic } from "@/features/chat-layout/model/hooks/useChatLayoutLogic";

const ChatLayout = () => {
  const { isMobile, isActive } = useChatLayoutLogic();

  const clazz = clsx(s.chatContent, isMobile && s.mobile);
  const chatListClass = clsx(s.chatList, isMobile && isActive && s.hidden);
  const roomClass = clsx(s.roomContent, isMobile && !isActive && s.hidden);

  return (
    <div className={clazz}>
      <ChatSidebar chatListClass={chatListClass} />
      <MessageHeader />
      <ChatRoom roomClass={roomClass} />
    </div>
  );
};

export default ChatLayout;
