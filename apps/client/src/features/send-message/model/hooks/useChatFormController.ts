import { useSendMessage } from "./useSendMessage";
import { useEditMessageStore } from "../store/editMessage.store";
import { editMessage, editMessageSchemaType } from "../zod/editMessage.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useSearchQuery } from "@/shared/hooks/useSearchQuery";
import { useGetCurrentUserQuery } from "@/features/auth/api/auth.api";

export const useChatFormController = () => {
  const { data: currentUser } = useGetCurrentUserQuery();
  const { param: roomId } = useSearchQuery("chatId");

  const { updateMessage, handleTyping } = useSendMessage();

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

  const onEditSubmit = async (data: { editMessage: string }) => {
    if (editMessageId && currentUser?.id) {
      await updateMessage({
        roomId,
        msgId: editMessageId,
        ownerId: currentUser?.id,
        text: data.editMessage,
      });
      resetEdit();
      clearEditState();
    }
  };

  return {
    edit: {
      editRegister,
      editMessageId,
      handleSubmitEdit: handleSubmitEdit(onEditSubmit),
      onEditSubmit,
    },
    typingArgs: {
      handleTyping,
      roomId,
      currentUser,
    },
  };
};
