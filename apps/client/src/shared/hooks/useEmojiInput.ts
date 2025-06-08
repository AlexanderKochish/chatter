import { MessageSchemaType } from "@/features/send-message/model/zod/message.schema";
import { EmojiClickData } from "emoji-picker-react";
import { UseFormSetValue } from "react-hook-form";

export const useEmojiInput = (
  text: string,
  setValue: UseFormSetValue<MessageSchemaType>,
) => {
  const handleEmojiClick = (emoji: EmojiClickData) => {
    setValue("text", text + emoji.emoji);
  };

  return { handleEmojiClick };
};
