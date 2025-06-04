import { EmojiIcon, PaperPlaneIcon, UploadIcon } from "@shared/assets/icons";
import s from "./ChatForm.module.css";
import { useChatFormLogic } from "@features/send-message/model/hooks/useChatFormLogic";
import EmojiPicker, { Theme } from "emoji-picker-react";
import PopoverCustom from "@shared/ui/Popover/PopoverCustom";
import { useSendMessage } from "@features/send-message/model/hooks/useSendMessage";
import ImageViewer from "@/features/image-viewer/ui/ImageViewer/ImageViewer";
import MessageTextarea from "../MessageTextarea/MessageTextarea";
import { useChatFormController } from "@/features/send-message/model/hooks/useChatFormController";

const ChatForm = () => {
  const { handleTyping } = useSendMessage();
  const {
    formProps: { handleSubmit, register, textAreaRef },
    fileInputProps: { handleFileChange },
  } = useChatFormLogic();

  const { 
    edit:{ editMessageId, editRegister, handleSubmitEdit, onEditSubmit}, 
    emoji:{handleEmojiClick},
    typingArgs: { roomId, me }
  } = useChatFormController()

  return (
    <div className={s.formWrapper}>
      <form
        id="sendMessageForm"
        className={s.formMessage}
        onSubmit={editMessageId ? handleSubmitEdit(onEditSubmit) : handleSubmit}
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
            typingCallback={() => handleTyping(roomId, me?.id)}
          />
        ) : (
          <MessageTextarea 
            name="editMessage" 
            register={editRegister} 
            textAreaRef={textAreaRef} 
            typingCallback={() => handleTyping(roomId, me?.id)}
          />
        )}
        <label htmlFor="images" className={s.fileLabel}>
          <UploadIcon width="30" height="30" />
        </label>
        <input
          type="file"
          id="images"
          className={s.file}
          onChange={handleFileChange}
        />
      </form>
      <button form="sendMessageForm" className={s.sendBtn}>
        <PaperPlaneIcon width="25" height="25" />
      </button>
      <ImageViewer/>
    </div>
  );
};

export default ChatForm;
