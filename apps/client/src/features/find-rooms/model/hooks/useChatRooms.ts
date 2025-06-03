import { useQuery } from "@tanstack/react-query";
import { getChatRoom } from "../../../../shared/api";
import { ChatRoomResponse } from "../../../../shared/types";

export const useChatRooms = () => {
  const { data: chatRooms, ...rest } = useQuery({
    queryKey: ["myChatRooms"],
    queryFn: getChatRoom,
    select: (res): ChatRoomResponse[] => res?.data,
  });

  return { chatRooms, ...rest };
};
