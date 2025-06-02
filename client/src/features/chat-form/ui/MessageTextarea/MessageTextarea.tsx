import { RefObject } from "react";
import { UseFormRegister } from "react-hook-form";
import s from "./MessageTextarea.module.css";
import { MessageSchemaType } from "@features/send-message/model/zod/message.schema";

type Props = {
  register: UseFormRegister<MessageSchemaType>;
  textAreaRef: RefObject<HTMLTextAreaElement | null>;
  isEdited: boolean;
};

const MessageTextarea = ({ register, textAreaRef }: Props) => {
  return (
    <textarea
      className={s.textArea}
      {...register("text")}
      ref={(e) => {
        register("text").ref(e);
        textAreaRef.current = e;
      }}
      placeholder="Message"
    />
  );
};

export default MessageTextarea;
