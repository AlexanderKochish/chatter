import { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import s from "./Button.module.css";
import clsx from "clsx";

type Props<T extends ElementType> = {
  children: ReactNode;
  color?: "danger" | "regular" | "warning";
  size?: "small" | "regular" | "large";
  asComponent?: T;
} & ComponentPropsWithRef<T>;

const Button = <T extends ElementType = "button">({
  asComponent,
  children,
  color = "regular",
  size = "regular",
  ...rest
}: Props<T>) => {
  const Component = asComponent ?? "button";

  return (
    <Component className={clsx(s.btn, s[size], s[color])} {...rest}>
      {children}
    </Component>
  );
};

export default Button;
