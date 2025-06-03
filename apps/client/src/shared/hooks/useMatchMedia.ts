import { useState, useLayoutEffect, useCallback, useMemo } from "react";

const queries = [
  "(max-width: 766px)",
  "(min-width: 767px) and (max-width: 1024px)",
];

type ScreenSizes = "isMobile" | "isTablet";

type MatchMediaResult = Record<ScreenSizes, boolean>;

export const useMatchMedia = () => {
  const mediaQueryLists = useMemo(() => {
    if (typeof window === "undefined") return [];
    return queries.map((q) => window.matchMedia(q));
  }, []);

  const getValue = useCallback(
    () => mediaQueryLists.map((mql) => mql.matches),
    [mediaQueryLists],
  );
  const [values, setValues] = useState(getValue);

  useLayoutEffect(() => {
    const handler = () => setValues(getValue);

    mediaQueryLists.forEach((mql) => mql.addEventListener("change", handler));

    return () => {
      mediaQueryLists.forEach((mql) => {
        mql.removeEventListener("change", handler);
      });
    };
  }, [getValue, mediaQueryLists]);

  return ["isMobile", "isTablet"].reduce(
    (acc, screen, i) => ({
      ...acc,
      [screen]: values[i],
    }),
    {},
  ) as MatchMediaResult;
};
