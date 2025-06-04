import { useProfile } from "@shared/api/queries/useProfile";
import { useSendMessage } from "./useSendMessage";
import { useEditMessageStore } from "../store/editMessage.store";
import { editMessage, editMessageSchemaType } from "../zod/editMessage.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useSearchQuery } from "@/shared/hooks/useSearchQuery";

export const useChatFormController = () => {
  const { me } = useProfile();
  const { param: roomId } = useSearchQuery('chatId')

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
    console.log(data)
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
    edit: {
      editRegister,
      editMessageId,
      handleSubmitEdit: handleSubmitEdit(onEditSubmit),
      onEditSubmit,
    },
    typingArgs: {
      handleTyping,
      roomId,
      me
    }
  };
};
