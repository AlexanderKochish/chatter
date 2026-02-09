import { useFindUserOnlineQuery } from '@/features/find-user/api/find-user.api'
import { useGetCurrentUserQuery } from '@/features/auth/api/auth.api'
import { useFindChatsQuery } from '../../api/find-rooms.api'

export const useUserOnline = () => {
  const { data: currentUser } = useGetCurrentUserQuery()
  const { data: chats } = useFindChatsQuery()

  const usersIds =
    chats?.reduce<string[]>((acc, room) => {
      for (const member of room.members) {
        if (member.userId !== currentUser?.id) {
          acc.push(member.userId)
        }
      }
      return acc
    }, []) ?? []

  const { data, ...rest } = useFindUserOnlineQuery(usersIds, {
    skip: !usersIds?.length,
  })

  return { data, ...rest }
}
