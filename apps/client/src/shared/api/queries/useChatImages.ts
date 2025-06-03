import { useQuery } from "@tanstack/react-query";
import { getAllImagesOfChat } from "../api";

export const useChatImages = (roomId: string) => {
  const { data, ...rest } = useQuery({
    queryKey: ["images", roomId],
    queryFn: () => getAllImagesOfChat(roomId),
    select: (res) => res?.data,
    enabled: !!roomId,
  });

  return { data, ...rest };
};
