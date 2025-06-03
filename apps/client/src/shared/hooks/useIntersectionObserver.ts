import { useEffect, useRef } from "react";

type Props = {
  hasMore: boolean;
  loading?: boolean;
  fetchMore: () => Promise<void>;
};

export const useIntersectionObserver = ({
  hasMore,
  loading,
  fetchMore,
}: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loader = loaderRef.current;
    if (!loader || loading || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading) {
          fetchMore();
        }
      },
      {
        root: containerRef.current,
        rootMargin: "10px",
        threshold: 0.1,
      },
    );

    observer.observe(loader);
    return () => observer.disconnect();
  }, [hasMore, loading, fetchMore]);

  return { containerRef, loaderRef };
};
