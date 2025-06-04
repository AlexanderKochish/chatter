import { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import s from "./Button.module.css";
import clsx from "clsx";

type Props<T extends ElementType> = {
  children: ReactNode;
  color?: "danger" | "text" | "warning";
  size?: "small" | "regular" | "large";
  asComponent?: T;
  className?: string
} & ComponentPropsWithRef<T>;

const Button = <T extends ElementType = "button">({
  asComponent,
  children,
  color = "text",
  size,
  className = 'btn',
  ...rest
}: Props<T>) => {
  const Component = asComponent ?? "button";

  return (
    <Component className={clsx(s[className], s[size], s[color])} {...rest}>
      {children}
    </Component>
  );
};

export default Button;
