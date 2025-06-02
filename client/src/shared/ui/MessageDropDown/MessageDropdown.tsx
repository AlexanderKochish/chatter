import { ReactNode, useEffect, useRef } from "react";
import s from "./MessageDropdown.module.css";

type DropdownProps = {
  children: ReactNode;
  isOpen: boolean;
  position: { x: number; y: number } | null;
  onClose: () => void;
};

export const MessageDropdown = ({
  children,
  isOpen,
  position,
  onClose,
}: DropdownProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !position) return null;

  return (
    <div
      ref={ref}
      className={s.content}
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        zIndex: 999,
      }}
    >
      {children}
    </div>
  );
};
