import { RefObject } from "react";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import s from "./MessageTextarea.module.css";

type Props<T extends FieldValues> = {
  register: UseFormRegister<T>;
  textAreaRef: RefObject<HTMLTextAreaElement | null>;
  name: Path<T>;
  placeholder?: string
  typingCallback: () => void;
};

const MessageTextarea = <T extends FieldValues>({
   register,
    textAreaRef,
    name,
    placeholder,
    typingCallback
   }: Props<T>) => {
  return (
    <textarea
      className={s.textArea}
      {...register(name)}
      onChange={(e) => {
        typingCallback();
          register(name).onChange(e);
      }}
      ref={(e) => {
        register(name).ref(e);
          textAreaRef.current = e;
      }}
      placeholder={placeholder}
    />
  );
};

export default MessageTextarea;
