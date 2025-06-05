import { addNewChat } from "@/shared/api";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useAddNewCompanion = () => {
  const queryClient = useQueryClient();
  const { mutate, ...rest } = useMutation({
    mutationKey: ["addChat"],
    mutationFn: (userId: string) => addNewChat(userId),

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["myChatRooms"] });
    },
  });

  return { mutate, ...rest };
};
