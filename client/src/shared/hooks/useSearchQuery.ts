import { useSearchParams } from "react-router-dom";

export const useSearchQuery = (key: string) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const value = searchParams.get(key) ?? "";

  const setValue = (newValue: string) => {
    const updatedParams = new URLSearchParams(searchParams);
    updatedParams.set(key, newValue);
    setSearchParams(updatedParams);
  };

  return {
    param: value,
    setSearchParams: setValue,
  };
};
