import { ChatRoomResponse } from '@/shared/types'
import UserCard from '@/shared/ui/UserCard/UserCard'
import s from './ChatRoomList.module.css'
import { useUserOnline } from '../../model/hooks/useUserOnline'
import { useChatLayoutLogic } from '@/features/chat-layout/model/hooks/useChatLayoutLogic'
import { useFindChatsQuery } from '../../api/find-rooms.api'
import { useParams } from 'react-router-dom'

const ChatRoomList = () => {
  const { findMyChat, currentUser } = useChatLayoutLogic()
  const { data: chats } = useFindChatsQuery()
  const { roomId } = useParams()
  const { data } = useUserOnline(chats, currentUser!)

  return (
    <div className={s.openedChats}>
      {chats?.map(({ id, members, messages }: ChatRoomResponse) => (
        <li
          key={id}
          onClick={() => findMyChat(id)}
          onKeyDown={(e) => e.key === 'Enter' && findMyChat(id)}
          role="button"
          tabIndex={0}
        >
          {members?.map((user) => {
            if (currentUser?.id !== user.userId) {
              return (
                <UserCard
                  active={id === roomId}
                  name={user.user.name}
                  avatar={user.user.profile.avatar as string}
                  lastMessage={messages[0]?.text ?? ''}
                  key={user.userId}
                  isOnline={!!data?.[user?.userId]}
                />
              )
            }
          })}
        </li>
      ))}
    </div>
  )
}

export default ChatRoomList
