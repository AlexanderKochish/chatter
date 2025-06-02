import { useQuery } from "@tanstack/react-query";
import { searchUserByName } from "../../../shared/api";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import { zodResolver } from "@hookform/resolvers/zod";
import { searchSchema, SearchShemaType } from "./zod/find-user.schema";
import { useForm } from "react-hook-form";

export const useSearchUser = () => {
  const { control, handleSubmit, watch } = useForm<SearchShemaType>({
    defaultValues: {
      search: "",
    },
    resolver: zodResolver(searchSchema),
  });

  const search = watch("search");

  const { debounceValue } = useDebounce({ value: search, delay: 1000 });
  const { data } = useQuery({
    queryKey: ["users", debounceValue],
    queryFn: () => searchUserByName(debounceValue),
    enabled: !!debounceValue,
  });

  return {
    control,
    handleSubmit,
    data: data?.data,
  };
};
