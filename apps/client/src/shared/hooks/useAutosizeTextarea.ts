import { useEffect } from "react";

export function useAutosizeTextarea(
  textareaRef: React.RefObject<HTMLTextAreaElement | null>,
  value: string,
) {
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [value, textareaRef]);
}
