import { ReactNode, useState } from "react";
import { CloseEyeIcon, OpenEyeIcon } from "@shared/assets/icons";
import s from "./Input.module.css";
import { FieldValues, Control, Path, useController } from "react-hook-form";
import clsx from "clsx";

interface MyInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  icon?: boolean;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  search?: ReactNode;
  type?: 'email' | 'password' | 'text' 
}

const Input = <T extends FieldValues>({
  defaultValue,
  name,
  control,
  icon = false,
  placeholder,
  className = "",
  search,
  type = 'text'
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
      <div className={clsx(s.inputWrapper, s[className])}>
        <input
          {...field}
          className={s.input}
          id={name}
          type={!icon ? type : changeInputType}
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
        {search}
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
