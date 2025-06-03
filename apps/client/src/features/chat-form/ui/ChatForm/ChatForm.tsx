import { EmojiIcon, PaperPlaneIcon, UploadIcon } from "@shared/assets/icons";
import s from "./ChatForm.module.css";
import ReactCrop from "react-image-crop";
import CropFileModal from "@features/send-message/ui/CropFileModal/CropFileModal";
import { useChatFormLogic } from "@features/send-message/model/hooks/useChatFormLogic";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import PopoverCustom from "@shared/ui/Popover/PopoverCustom";
import { useEditMessage } from "@features/send-message/model/store/editMessage.store";
import {
  editMessage,
  editMessageSchemaType,
} from "@features/send-message/model/zod/editMessage.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useSendMessage } from "@features/send-message/model/hooks/useSendMessage";
import { useProfile } from "@shared/api/queries/useProfile";
import { useSearchQuery } from "@/shared/hooks/useSearchQuery";

const ChatForm = () => {
  const { me } = useProfile();
  const { param: roomId } = useSearchQuery("chatId");
  const { updateMessage, handleTyping } = useSendMessage();
  const {
    formProps: { handleSubmit, register, textAreaRef, setValue, watch },
    cropProps: {
      crop,
      imgSrc,
      isOpen,
      onCropComplete,
      setCompletedCrop,
      setCrop,
      setIsOpen,
      imgRef,
    },
    fileInputProps: { handleFileChange },
  } = useChatFormLogic();
  const { editMessageId, editText, clearEditState } = useEditMessage();
  const {
    register: editRegister,
    setValue: setEditValue,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
  } = useForm<editMessageSchemaType>({
    defaultValues: {
      editMessage: "",
    },
    resolver: zodResolver(editMessage),
  });

  useEffect(() => {
    if (editMessageId && editText) {
      setEditValue("editMessage", editText);
    }
  }, [editMessageId, editText, setEditValue]);

  const text = watch("text");
  const handleEmojiClick = (data: EmojiClickData) => {
    const newValue = text + data.emoji;
    setValue("text", newValue);
  };

  const onSubmit = async (data: { editMessage: string }) => {
    if (editMessageId && me?.id) {
      await updateMessage({
        roomId,
        msgId: editMessageId,
        ownerId: me?.id,
        text: data.editMessage,
      });
      resetEdit();
      clearEditState();
    }
  };

  return (
    <div className={s.formWrapper}>
      <form
        id="sendMessageForm"
        className={s.formMessage}
        onSubmit={editMessageId ? handleSubmitEdit(onSubmit) : handleSubmit}
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
          <textarea
            className={s.textArea}
            {...register("text")}
            name="text"
            onChange={(e) => {
              handleTyping(roomId, me?.id);
              register("text").onChange(e);
            }}
            ref={(e) => {
              register("text").ref(e);
              textAreaRef.current = e;
            }}
            placeholder="Message"
          />
        ) : (
          <textarea
            className={s.textArea}
            {...editRegister("editMessage")}
            name="editMessage"
            onChange={(e) => {
              handleTyping(roomId, me?.id);
              editRegister("editMessage").onChange(e);
            }}
            ref={(e) => {
              editRegister("editMessage").ref(e);
              textAreaRef.current = e;
            }}
          />
        )}
        <CropFileModal setIsOpen={setIsOpen} isOpen={isOpen} position="50">
          {!!imgSrc && (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              minWidth={400}
              minHeight={200}
              circularCrop
              ruleOfThirds
            >
              <img ref={imgRef} alt="Crop me" src={imgSrc} />
            </ReactCrop>
          )}
          <div>
            <input type="text" />
            <button onClick={onCropComplete}>Send</button>
          </div>
        </CropFileModal>
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
    </div>
  );
};

export default ChatForm;
