import { RefObject } from 'react'
import { FieldValues, Path, UseFormRegister } from 'react-hook-form'

type Props<T extends FieldValues> = {
  register: UseFormRegister<T>
  textAreaRef: RefObject<HTMLTextAreaElement | null>
  name: Path<T>
  placeholder?: string
  typingCallback: () => void
  className?: string
}

const MessageTextarea = <T extends FieldValues>({
  register,
  textAreaRef,
  name,
  placeholder,
  typingCallback,
  className,
}: Props<T>) => {
  return (
    <textarea
      style={{ resize: 'none' }}
      className={className}
      {...register(name)}
      onChange={(e) => {
        typingCallback()
        register(name).onChange(e)
      }}
      ref={(e) => {
        register(name).ref(e)
        textAreaRef.current = e
      }}
      placeholder={placeholder}
    />
  )
}

export default MessageTextarea
