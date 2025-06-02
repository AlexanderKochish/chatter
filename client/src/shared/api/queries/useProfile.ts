import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api";

export const useProfile = () => {
  const { data: me, ...rest } = useQuery({
    queryKey: ["profile"],
    queryFn: getMe,
    select: (res) => res?.data,
  });

  return { me, ...rest };
};
