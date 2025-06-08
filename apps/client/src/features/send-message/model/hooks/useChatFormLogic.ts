import { MessageSchemaType } from "../zod/message.schema";
import { useSendMessage } from "./useSendMessage";
import { useProfile } from "@shared/api/queries/useProfile";
import { useSearchQuery } from "@/shared/hooks/useSearchQuery";
import { useMessageForm } from "@/features/chat-form/model/hooks/useMessageForm";
import { useImageAttachment } from "@/shared/hooks/useImageAttachment";
import { useEmojiInput } from "@/shared/hooks/useEmojiInput";

export const useChatFormLogic = () => {
  const { me } = useProfile();
  const { param: roomId } = useSearchQuery("chatId");
  const { sendMessage } = useSendMessage();
  const { register, reset, handleSubmit, textAreaRef, setValue, text } =
    useMessageForm();

  const { imgSrc, handleFileChange } = useImageAttachment(setValue);

  const { handleEmojiClick } = useEmojiInput(text, setValue);

  const onSubmit = async (data: MessageSchemaType) => {
    if (!me.id) return;
    const message = {
      roomId,
      ownerId: me?.id,
      text: data.text,
      images: data.images ?? [],
    };
    await sendMessage(message as MessageSchemaType);
    reset();
  };

  return {
    formProps: {
      register,
      handleSubmit: handleSubmit(onSubmit),
      textAreaRef,
    },
    cropProps: {
      imgSrc,
    },
    fileInputProps: {
      handleFileChange,
    },
    emoji: {
      handleEmojiClick,
    },
  };
};
