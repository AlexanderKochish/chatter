import { EmojiIcon, PaperPlaneIcon, UploadIcon } from "@shared/assets/icons";
import s from "./ChatForm.module.css";
import { useChatFormLogic } from "@features/send-message/model/hooks/useChatFormLogic";
import EmojiPicker, { Theme } from "emoji-picker-react";
import PopoverCustom from "@shared/ui/Popover/PopoverCustom";
import ImageViewer from "@/features/image-viewer/ui/ImageViewer/ImageViewer";
import MessageTextarea from "../MessageTextarea/MessageTextarea";
import { useChatFormController } from "@/features/send-message/model/hooks/useChatFormController";

const ChatForm = () => {
  const {
    formProps: { handleSubmit, register, textAreaRef },
    fileInputProps: { handleFileChange },
    cropProps: { imgSrc },
    emoji: { handleEmojiClick },
  } = useChatFormLogic();

  const {
    edit: { editMessageId, editRegister, handleSubmitEdit },
    typingArgs: { roomId, me, handleTyping },
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

        {imgSrc ? (
          <div className={s.preview}>
            <img src={imgSrc} alt="preview" className={s.imagePreview} />
          </div>
        ) : (
          <label htmlFor="images" className={s.fileLabel}>
            <UploadIcon width="30" height="30" />
          </label>
        )}
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
      <ImageViewer />
    </div>
  );
};

export default ChatForm;
