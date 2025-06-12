import { useDebounce } from "@shared/hooks/useDebounce";
import { zodResolver } from "@hookform/resolvers/zod";
import { searchSchema, SearchShemaType } from "./zod/find-user.schema";
import { useForm } from "react-hook-form";
import { useFindUserQuery } from "../api/find-user.api";

export const useSearchUser = () => {
  const { control, handleSubmit, watch } = useForm<SearchShemaType>({
    defaultValues: {
      search: "",
    },
    resolver: zodResolver(searchSchema),
  });

  const search = watch("search");
  const { debounceValue } = useDebounce({ value: search, delay: 1000 });
  const { data, ...rest } = useFindUserQuery(debounceValue, { skip: !debounceValue})

  return {
    control,
    handleSubmit,
    data,
    ...rest,
  };
};
