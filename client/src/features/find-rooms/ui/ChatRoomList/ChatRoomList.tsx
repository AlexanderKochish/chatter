import { ChatRoomResponse } from "@shared/types";
import UserCard from "@shared/ui/UserCard/UserCard";
import { useChatRooms } from "../../model/hooks/useChatRooms";
import s from "./ChatRoomList.module.css";
import { useUserOnline } from "../../model/hooks/useUserOnline";
import { useChatLayoutLogic } from "@/features/chat-layout/model/hooks/useChatLayoutLogic";
import { useSearchQuery } from "@/shared/hooks/useSearchQuery";

const ChatRoomList = () => {
  const { findMyChat, me } = useChatLayoutLogic();
  const { chatRooms } = useChatRooms();
  const { param: roomId } = useSearchQuery("chatId");
  const { data } = useUserOnline(chatRooms, me);

  return (
    <div className={s.openedChats}>
      {chatRooms?.map(({ id, members, messages }: ChatRoomResponse) => (
        <li
          key={id}
          onClick={() => findMyChat(id)}
          onKeyDown={(e) => e.key === "Enter" && findMyChat(id)}
          role="button"
          tabIndex={0}
        >
          {members?.map((user) => {
            if (me?.id !== user.userId) {
              return (
                <UserCard
                  active={id === roomId}
                  name={user.user.name}
                  avatar={user.user.profile.avatar as string}
                  lastMessage={messages[0]?.text ?? ""}
                  key={user.userId}
                  isOnline={Boolean(data?.[user.userId])}
                />
              );
            }
          })}
        </li>
      ))}
    </div>
  );
};

export default ChatRoomList;
