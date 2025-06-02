import clsx from "clsx";
import s from "./MessageItem.module.css";
import { Message } from "@shared/types";
import { LinkifiedText } from "@shared/ui/LinkifiedText/LinkifiedText";
import { format } from "date-fns";
import DropDownItem from "@shared/ui/DropdownItem/DropDownItem";
import { BinIcon, CopyIcon, PencilIcon } from "@shared/assets/icons";
import { MessageDropdown } from "@shared/ui/MessageDropDown/MessageDropdown";
import { useSendMessage } from "../../model/hooks/useSendMessage";
import { useMessageContextMenu } from "../../model/hooks/useMessageContextMenu";
import { useChatLayoutLogic } from "@/features/chat-layout/model/hooks/useChatLayoutLogic";
import { motion } from "framer-motion";
import { copyToClipboard } from "@/shared/lib/helpers/copyToClipboard";

type Props = {
  item: Message;
  setOpenImage: (id: string) => void;
};

const MessageItem = ({ item, setOpenImage }: Props) => {
  const { me } = useChatLayoutLogic();
  const { removeMessage } = useSendMessage();
  const {
    openMessageId,
    dropdownPosition,
    handleEditMessage,
    onCloseMenu,
    edit,
  } = useMessageContextMenu();
  const isOpen = openMessageId === item.id;
  const ownMessage = item.ownerId === me?.id ? s.own : "";

  const handleRemoveMessage = (item: Message) => {
    removeMessage({
      roomId: item.roomId,
      msgId: item.id,
      ownerId: item.ownerId,
    });
    onCloseMenu();
  };

  return (
    <div
      onContextMenu={(e) => handleEditMessage(e, item.id)}
      className={clsx(s.message, ownMessage, isOpen ? s.editMessage : "")}
      tabIndex={0}
      role="button"
    >
      <motion.div
        className={clsx(s.messageWrapper, ownMessage)}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        <span>
          <LinkifiedText text={item.text} />
        </span>

        {item.images &&
          item.images.length > 0 &&
          item.images.map(({ id, url }) => (
            <div
              key={id}
              className={s.messageImage}
              onClick={() => setOpenImage(id)}
              onKeyDown={(e) => e.key === "Enter" && setOpenImage(id)}
              role="button"
              tabIndex={0}
            >
              <img src={url} alt="message" />
            </div>
          ))}
        <div className={s.messageInfo}>
          {item.edited && <span>edited</span>}
          <span className={s.createdAt}>
            {format(new Date(item.createdAt), "hh:mm a")}
          </span>
        </div>
      </motion.div>
      <MessageDropdown
        isOpen={isOpen}
        position={dropdownPosition}
        onClose={onCloseMenu}
      >
        {item.ownerId === me?.id && (
          <DropDownItem
            icon={<PencilIcon />}
            text="Edit"
            onClick={() => edit(item.id, item.text)}
          />
        )}
        <DropDownItem
          icon={<CopyIcon />}
          text="Copy"
          onClick={() => {
            copyToClipboard(item.text);
            onCloseMenu();
          }}
        />
        <DropDownItem
          icon={<BinIcon width="20" height="20" />}
          className="danger"
          text="Delete"
          onClick={() => handleRemoveMessage(item)}
        />
      </MessageDropdown>
    </div>
  );
};

export default MessageItem;
