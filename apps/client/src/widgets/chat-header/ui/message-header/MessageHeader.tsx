import s from "./MessageHeader.module.css";
import {
  ArrowLeftIcon,
  BinIcon,
  HandIcon,
  PencilIcon,
  PersonIcon,
  VerticalDotsIcon,
} from "@shared/assets/icons";
import DropdownMenuCustom from "@shared/ui/DropdownMenu/DropdownMenu";
import { useChatCompanion } from "@shared/api/queries/useChatCompanion";
import ConfirmModal from "@shared/ui/ConfirmModal/ConfirmModal";
import { useLogout } from "@features/auth/model/hooks/useLogout";
import DropDownItem from "@shared/ui/DropdownItem/DropDownItem";
import { useChatLayoutStore } from "@/features/chat-layout/model/store/useChatLayoutStore";
import { useChatLayoutLogic } from "@/features/chat-layout/model/hooks/useChatLayoutLogic";
import { useTypingListener } from "@/shared/lib/hooks/useTypingListener";
import Button from "@/shared/ui/Button/Button";

const MessageHeader = () => {
  const { toggleIsActive, isRemoveChat, setIsRemoveChat } =
    useChatLayoutStore();
  const { isMobile, roomId } = useChatLayoutLogic();
  const { companion } = useChatCompanion(roomId);
  const { mutate } = useLogout();
  const { isTyping } = useTypingListener();

  return (
    <div className={s.topNavbar}>
      <div className={s.chosenUser}>
        {isMobile && (
          <Button className="link" onClick={toggleIsActive}>
            <ArrowLeftIcon width="25" height="25" />
          </Button>
        )}

        {companion?.user.profile.avatar ? (
          <img
            src={companion.user.profile.avatar}
            alt="avatar"
            className={s.avatar}
          />
        ) : (
          <PersonIcon width="50" height="50" />
        )}
        <div className={s.chosenUsername}>
          <span>{companion?.user.name}</span>
          {isTyping && <span className={s.typing}>typing...</span>}
        </div>
      </div>
      <div className={s.chatNav}>
        <DropdownMenuCustom
          trigger={
            <Button className="link">
              <VerticalDotsIcon
                width="25"
                height="25"
                aria-label="Customise options"
              />
            </Button>
          }
        >
          <DropDownItem
            icon={<PencilIcon width="15" height="15" />}
            text="Edit"
          />
          <DropDownItem icon={<HandIcon />} text="Block user" />
          <DropDownItem
            icon={<BinIcon width="20" height="20" />}
            className="danger"
            text="Delete chat"
            onClick={() => setIsRemoveChat(true)}
          />
        </DropdownMenuCustom>
      </div>
      <ConfirmModal
        mutate={mutate}
        isOpen={isRemoveChat}
        setIsOpen={setIsRemoveChat}
        position="50"
      >
        Are you sure you want to delete the chat?
      </ConfirmModal>
    </div>
  );
};

export default MessageHeader;
