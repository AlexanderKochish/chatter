import { useProfile } from "@shared/api/queries/useProfile";
import { useSendMessage } from "./useSendMessage";
import { useEditMessageStore } from "../store/editMessage.store";
import { editMessage, editMessageSchemaType } from "../zod/editMessage.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { EmojiClickData } from "emoji-picker-react";
import { useChatFormLogic } from "./useChatFormLogic";
import { useSearchQuery } from "@/shared/hooks/useSearchQuery";

export const useChatFormController = () => {
  const { me } = useProfile();
  const { param: roomId } = useSearchQuery('chatId')
  const {
    formProps: { setValue, watch },
  } = useChatFormLogic();

  const { updateMessage } = useSendMessage();

  const { editMessageId, editText, clearEditState } = useEditMessageStore();
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

  const onEditSubmit = async (data: { editMessage: string }) => {
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

  return {
    emoji: {
      handleEmojiClick,
    },
    edit: {
      editRegister,
      editMessageId,
      handleSubmitEdit,
      onEditSubmit,
    },
    typingArgs: {
      roomId,
      me
    }
  };
};
