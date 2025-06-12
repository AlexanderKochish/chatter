import { MessageSchemaType } from "../zod/message.schema";
import { useSendMessage } from "./useSendMessage";
import { useSearchQuery } from "@/shared/hooks/useSearchQuery";
import { useMessageForm } from "@/features/chat-form/model/hooks/useMessageForm";
import { useImageAttachment } from "@/shared/hooks/useImageAttachment";
import { useEmojiInput } from "@/shared/hooks/useEmojiInput";
import { useGetCurrentUserQuery } from "@/features/auth/api/auth.api";
import { setIsOpen } from "@/features/image-viewer/model/store/image.store";
import { useDispatch } from "react-redux";

export const useChatFormLogic = () => {
  const dispatch = useDispatch()
  const { data: user } = useGetCurrentUserQuery();
  const { param: roomId } = useSearchQuery("chatId");
  const { sendMessage } = useSendMessage();
  const {
    handleSubmit,
    formState:{
      errors
    },
    ...rest
  } = useMessageForm();

  const { handleFileChange } = useImageAttachment(
    rest.setValue, 
    rest.setError, 
    rest.clearErrors
  );

  const { handleEmojiClick } = useEmojiInput(rest.text, rest.setValue);

  const onSubmit = async (data: MessageSchemaType) => {
    if (!user?.id || !roomId) return;
    try {
      const message = {
        roomId,
        ownerId: user.id,
        text: data.text,
        images: data.images ?? [],
      };

      await sendMessage(message as MessageSchemaType);
      rest.reset();
      dispatch(setIsOpen(false));
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return {
    formProps: {
      handleSubmit: handleSubmit(onSubmit),
      errors,
      ...rest
    },
    fileInputProps: {
      handleFileChange,
    },
    emoji: {
      handleEmojiClick,
    },
  };
};
