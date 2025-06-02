import MainHeader from "@widgets/chat-header/ui/main-header/MainHeader";
import ChatRoomList from "@features/find-rooms/ui/ChatRoomList/ChatRoomList";

type Props = {
  chatListClass: string;
};

const ChatSidebar = ({ chatListClass }: Props) => {
  return (
    <div className={chatListClass}>
      <MainHeader />
      <ChatRoomList />
    </div>
  );
};

export default ChatSidebar;
