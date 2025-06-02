import { useState, MouseEvent } from "react";
import { useEditMessage } from "../store/editMessage.store";

export const useMessageContextMenu = () => {
  const [dropdownPosition, setDropdownPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const { openMessageId, setOpenMessageId, setEditMessageId, setEditText } =
    useEditMessage();

  const handleEditMessage = (
    e: MouseEvent<HTMLDivElement>,
    messageId: string,
  ) => {
    e.preventDefault();
    const container = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - container.left;
    const clickY = e.clientY - container.top;

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
