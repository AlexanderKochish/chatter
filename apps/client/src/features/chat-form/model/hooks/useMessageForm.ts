import {
  messageSchema,
  MessageSchemaType,
} from "@/features/send-message/model/zod/message.schema";
import { useAutosizeTextarea } from "@/shared/hooks/useAutosizeTextarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { useForm } from "react-hook-form";

export const useMessageForm = () => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const form = useForm<MessageSchemaType>({
    defaultValues: {
      text: "",
      roomId: "",
      ownerId: "",
      images: [],
    },
    resolver: zodResolver(messageSchema),
  });
  const text = form.watch("text");
  useAutosizeTextarea(textAreaRef, text);

  return {
    ...form,
    textAreaRef,
    text,
  };
};
