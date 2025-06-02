import { useState } from "react";
import { CloseEyeIcon, OpenEyeIcon } from "../../assets/icons";
import s from "./Input.module.css";
import { FieldValues, Control, Path, useController } from "react-hook-form";

interface MyInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  icon?: boolean;
  defaultValue?: string;
  placeholder?: string;
}

const Input = <T extends FieldValues>({
  defaultValue,
  name,
  control,
  icon = false,
  placeholder,
}: MyInputProps<T>) => {
  const {
    field,
    fieldState: { error },
    formState: { errors, isSubmitted },
  } = useController({ control, name });
  const [show, setShow] = useState(false);

  const changeInputType = show ? "text" : "password";

  return (
    <div className={s.inputBlock}>
      <div className={s.inputWrapper}>
        <input
          {...field}
          className={s.input}
          id={name}
          type={!icon ? "text" : changeInputType}
          defaultValue={defaultValue}
          placeholder={placeholder}
        />
        {icon && (
          <button
            type="button"
            onClick={() => setShow((prev) => !prev)}
            className={s.btn}
          >
            {show ? <OpenEyeIcon /> : <CloseEyeIcon />}
          </button>
        )}
      </div>
      {errors && isSubmitted && (
        <label className={s.error} htmlFor={name}>
          {error?.message}
        </label>
      )}
    </div>
  );
};

export default Input;
