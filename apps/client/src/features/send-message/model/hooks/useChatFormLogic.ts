import { MessageSchemaType } from "../zod/message.schema";
import { useSendMessage } from "./useSendMessage";
import { useProfile } from "@shared/api/queries/useProfile";
import { useSearchQuery } from "@/shared/hooks/useSearchQuery";
import { useMessageForm } from "@/features/chat-form/model/hooks/useMessageForm";
import { useImageAttachment } from "@/shared/hooks/useImageAttachment";
import { useEmojiInput } from "@/shared/hooks/useEmojiInput";
import { useImageCropStore } from "@/shared/model/store/imageCrop.store";

export const useChatFormLogic = () => {
  const { me } = useProfile();
  const { param: roomId } = useSearchQuery("chatId");
  const { sendMessage } = useSendMessage();
  const { register, reset, handleSubmit, textAreaRef, setValue, text, control } =
    useMessageForm();

  const { handleFileChange } = useImageAttachment(setValue);
  const { setIsOpen } = useImageCropStore()

  const { handleEmojiClick } = useEmojiInput(text, setValue);

  const onSubmit = async (data: MessageSchemaType) => {
    if (!me?.id || !roomId) return;
    try {
      const message = {
        roomId,
        ownerId: me.id,
        text: data.text,
        images: data.images ?? [],
      };
      
      await sendMessage(message as MessageSchemaType);
      reset();
      setIsOpen(false);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return {
    formProps: {
      register,
      handleSubmit: handleSubmit(onSubmit),
      textAreaRef,
      setValue,
      control,
      reset
    },
    fileInputProps: {
      handleFileChange,
    },
    emoji: {
      handleEmojiClick,
    },
  };
};
