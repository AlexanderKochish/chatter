import { useQuery } from "@tanstack/react-query";
import { getUserOnline } from "@shared/api";
import { ChatRoomResponse } from "@/shared/types";

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

  const { data, ...rest } = useQuery({
    queryKey: ["online", usersIds],
    queryFn: () => getUserOnline(usersIds),
    select: (res) => res?.data,
    enabled: !!usersIds?.length,
  });

  return { data, ...rest };
};
