import { ChatRoomResponse } from "@/shared/types";
import { useFindUserOnlineQuery } from "@/features/find-user/api/find-user.api";

export const useUserOnline = (
  chatRooms: ChatRoomResponse[] | undefined,
  me: { id: string },
) => {
  const usersIds =
    chatRooms?.reduce<string[]>((acc, room) => {
      for (const member of room.members) {
        if (member.userId !== me?.id) {
          acc.push(member.userId);
        }
      }
      return acc;
    }, []) ?? [];

  const {data, ...rest} = useFindUserOnlineQuery(usersIds, {skip: !usersIds?.length})

  return { data, ...rest };
};
