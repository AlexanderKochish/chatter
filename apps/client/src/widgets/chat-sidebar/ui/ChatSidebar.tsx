import MainHeader from "@widgets/chat-header/ui/main-header/MainHeader";
import ChatRoomList from "@features/find-rooms/ui/ChatRoomList/ChatRoomList";

type Props = {
  chatListClass: string;
};

const ChatSidebar = ({ chatListClass }: Props) => {
  return (
    <aside className={chatListClass}>
      <MainHeader />
      <ChatRoomList />
    </aside>
  );
};

export default ChatSidebar;
