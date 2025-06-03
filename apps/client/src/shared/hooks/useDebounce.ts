import { useEffect, useState } from "react";

type Props = {
  value: string;
  delay?: number;
};

export const useDebounce = ({ value, delay = 500 }: Props) => {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebounceValue(value), delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [delay, value]);

  return { debounceValue };
};
