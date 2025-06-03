import { useQuery } from "@tanstack/react-query";
import { getCompanion } from "../api";

export const useChatCompanion = (roomId: string) => {
  const { data: companion, ...rest } = useQuery({
    queryKey: ["companion", roomId],
    queryFn: () => getCompanion(roomId),
    select: (res) => res?.data,
    enabled: !!roomId,
  });

  return { companion, ...rest };
};
