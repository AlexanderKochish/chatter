import { EmojiIcon, PaperPlaneIcon } from "@/shared/assets/icons";
import s from "./ChatForm.module.css";
import { useChatFormLogic } from "@/features/send-message/model/hooks/useChatFormLogic";
import EmojiPicker, { Theme } from "emoji-picker-react";
import PopoverCustom from "@/shared/ui/Popover/PopoverCustom";
import MessageTextarea from "../MessageTextarea/MessageTextarea";
import { useChatFormController } from "@/features/send-message/model/hooks/useChatFormController";
import UploadImageInput from "../UploadImageInput/UploadImageInput";
import { useGetCurrentUserQuery } from "@/features/auth/api/auth.api";

const ChatForm = () => {
  const { data: currentUser } = useGetCurrentUserQuery();
  const {
    formProps: { handleSubmit, register, textAreaRef },
    emoji: { handleEmojiClick },
  } = useChatFormLogic();

  const {
    edit: { editMessageId, editRegister, handleSubmitEdit },
    typingArgs: { roomId, handleTyping },
  } = useChatFormController();

  return (
    <div className={s.formWrapper}>
      <form
        id="sendMessageForm"
        className={s.formMessage}
        onSubmit={editMessageId ? handleSubmitEdit : handleSubmit}
      >
        <PopoverCustom trigger={<EmojiIcon width="30" height="30" />}>
          <EmojiPicker
            searchDisabled
            lazyLoadEmojis
            theme={Theme.AUTO}
            onEmojiClick={handleEmojiClick}
          />
        </PopoverCustom>
        {!editMessageId ? (
          <MessageTextarea
            placeholder="Message"
            name="text"
            register={register}
            textAreaRef={textAreaRef}
            typingCallback={() =>
              handleTyping(roomId, currentUser?.id as string)
            }
          />
        ) : (
          <MessageTextarea
            name="editMessage"
            register={editRegister}
            textAreaRef={textAreaRef}
            typingCallback={() =>
              handleTyping(roomId, currentUser?.id as string)
            }
          />
        )}
        <UploadImageInput />
      </form>
      <button form="sendMessageForm" className={s.sendBtn}>
        <PaperPlaneIcon width="25" height="25" />
      </button>
    </div>
  );
};

export default ChatForm;
