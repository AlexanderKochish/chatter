import { useState, MouseEvent, TouchEvent as ReactTouchEvent } from "react";
import { useEditMessageStore } from "../store/editMessage.store";

export const useMessageContextMenu = () => {
  const [dropdownPosition, setDropdownPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const { openMessageId, setOpenMessageId, setEditMessageId, setEditText } =
    useEditMessageStore();

  const handleEditMessage = (
    e: MouseEvent<HTMLDivElement> | ReactTouchEvent<HTMLDivElement>,
    messageId: string,
    position?: { clientX: number; clientY: number },
  ) => {
    e.preventDefault();
    const container = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const clickX = position
      ? position.clientX - container.left
      : (e as MouseEvent).clientX - container.left;
    const clickY = position
      ? position.clientY - container.top
      : (e as MouseEvent).clientY - container.top;

    const menuWidth = 160;
    const menuHeight = 120;
    const maxX = container.width - menuWidth;
    const maxY = clickY - menuHeight;

    setDropdownPosition({
      x: Math.min(clickX, maxX),
      y: Math.min(clickY, maxY),
    });

    setOpenMessageId(messageId);
  };

  const onCloseMenu = () => setOpenMessageId(null);

  const edit = (messageId: string, messageText: string) => {
    setEditMessageId(messageId);
    setEditText(messageText);
    setOpenMessageId(null);
    onCloseMenu();
  };

  return {
    openMessageId,
    onCloseMenu,
    edit,
    dropdownPosition,
    handleEditMessage,
  };
};
