import s from "./MessageHeader.module.css";
import { useSearchUser } from "@features/find-user/model/useSearchUser";
import {
  ArrowLeftIcon,
  BinIcon,
  GlassIcon,
  HandIcon,
  PencilIcon,
  PersonIcon,
  VerticalDotsIcon,
} from "@shared/assets/icons";
import DialogModal from "@shared/ui/Modal/Modal";
import Input from "@shared/ui/Input/Input";
import ChatList from "@features/add-chat/ui/chat-list/ChatList";
import DropdownMenuCustom from "@shared/ui/DropdownMenu/DropdownMenu";
import { useChatCompanion } from "@shared/api/queries/useChatCompanion";
import ConfirmModal from "@shared/ui/ConfirmModal/ConfirmModal";
import { useLogout } from "@features/auth/model/hooks/useLogout";
import DropDownItem from "@shared/ui/DropdownItem/DropDownItem";
import { useChatLayoutStore } from "@/features/chat-layout/model/store/useChatLayoutStore";
import { useChatLayoutLogic } from "@/features/chat-layout/model/hooks/useChatLayoutLogic";
import { useTypingListener } from "@/shared/lib/hooks/useTypingListener";

const MessageHeader = () => {
  const {
    toggleIsActive,
    isRemoveChat,
    isSearch,
    setIsSearch,
    setIsRemoveChat,
  } = useChatLayoutStore();
  const { isMobile, roomId } = useChatLayoutLogic();
  const { control, handleSubmit, data } = useSearchUser();
  const { companion } = useChatCompanion(roomId);
  const { mutate } = useLogout();
  const { isTyping } = useTypingListener();

  return (
    <div className={s.topNavbar}>
      <div className={s.chosenUser}>
        {isMobile && (
          <button className={s.btnWrapper} onClick={toggleIsActive}>
            <ArrowLeftIcon width="25" height="25" />
          </button>
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
        <DialogModal
          isOpen={isSearch}
          setIsOpen={setIsSearch}
          title="Search"
          position="25"
        >
          <>
            <form onSubmit={handleSubmit((data) => data)}>
              <Input control={control} name="search" />
            </form>
            <ChatList chatList={data} />
          </>
        </DialogModal>
        <button className={s.btnWrapper} onClick={() => setIsSearch(true)}>
          <GlassIcon width="25" height="25" />
        </button>
        <DropdownMenuCustom
          trigger={
            <button className={s.btnWrapper}>
              <VerticalDotsIcon
                width="25"
                height="25"
                aria-label="Customise options"
              />
            </button>
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
