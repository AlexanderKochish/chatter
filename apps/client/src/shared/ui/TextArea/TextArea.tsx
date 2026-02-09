import { Control, FieldValues, Path, useController } from 'react-hook-form'

interface Props<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  icon?: React.ReactNode
  defaultValue?: string
  placeholder?: string
}

const TextArea = <T extends FieldValues>({
  control,
  name,
  icon,
  defaultValue,
  placeholder,
}: Props<T>) => {
  const {
    field,
    fieldState: { error },
    formState: { isSubmitted },
  } = useController({ name, control })

  return (
    <div className="flex items-center gap-x-2.5 w-full">
      {icon}
      <textarea
        {...field}
        id={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="border-none outline-none bg-transparent resize-none w-full focus:ring-0"
      />
      {error && isSubmitted && (
        <label
          className="text-amber-800 text-xs absolute -bottom-5 left-0"
          htmlFor={name}
        >
          {error?.message}
        </label>
      )}
    </div>
  )
}

export default TextArea
