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
import ConfirmModal from "@shared/ui/ConfirmModal/ConfirmModal";
import DropDownItem from "@shared/ui/DropdownItem/DropDownItem";
import { useTypingListener } from "@/shared/lib/hooks/useTypingListener";
import Button from "@/shared/ui/Button/Button";
import toast from "react-hot-toast";
import { useChatLayoutLogic } from "@/features/chat-layout/model/hooks/useChatLayoutLogic";
import { setIsRemoveChat, toggleIsActive } from "@/features/chat-layout/model/store/chat-layout.api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { useRemoveChatMutation } from "@/features/find-rooms/api/find-rooms.api";
import { useGetCompanionQuery } from "@/features/add-chat/api/add-companion.api";

const MessageHeader = () => {
  const isRemoveChat  = useSelector((state: RootState) => state.chatLayout.isRemoveChat)
  const [ removeChat, {isSuccess}] = useRemoveChatMutation()
  const { isMobile, roomId } = useChatLayoutLogic();
  const { data: companion } = useGetCompanionQuery(roomId)
  const { isTyping } = useTypingListener();
  const dispatch = useDispatch()

  if (isSuccess) {
    toast.success("Chat successfully deleted");
  }

  return (
    <div className={s.topNavbar}>
      <div className={s.chosenUser}>
        {isMobile && (
          <Button className="link" onClick={() => dispatch(toggleIsActive())}>
            <ArrowLeftIcon width="25" height="25" />
          </Button>
        )}

        {companion?.user.profile.avatar ? (
          <img
            src={String(companion?.user.profile.avatar)}
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
            onClick={() => {
              setIsRemoveChat(true);
            }}
          />
        </DropdownMenuCustom>
      </div>
      <ConfirmModal
        mutate={() => removeChat(roomId)}
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
