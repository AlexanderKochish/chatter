import { Control, FieldValues, Path, useController } from "react-hook-form";
import s from "./TextArea.module.css";

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  icon?: boolean;
  defaultValue?: string;
}

const TextArea = <T extends FieldValues>({
  control,
  name,
  icon,
  defaultValue,
}: Props<T>) => {
  const {
    field,
    fieldState: { error },
    formState: { errors, isSubmitted },
  } = useController({ name, control });
  return (
    <div className={s.textareaWrapper}>
      {icon}
      <textarea {...field} id={name} defaultValue={defaultValue} />
      {errors && isSubmitted && (
        <label className={s.error} htmlFor={name}>
          {error?.message}
        </label>
      )}
    </div>
  );
};

export default TextArea;
