import { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import s from "./DropDownItem.module.css";
import clsx from "clsx";

type Props<T extends ElementType> = {
  icon: ReactNode;
  text: string;
  className?: string;
  asComponent?: T;
} & ComponentPropsWithRef<T>;
const DropDownItem = <T extends ElementType = "button">({
  icon,
  text,
  className = "",
  asComponent,
  ...rest
}: Props<T>) => {
  const Component = asComponent ?? "button";
  return (
    <Component className={clsx(s.dropDownItem, s[className])} {...rest}>
      {icon}
      <span>{text}</span>
    </Component>
  );
};

export default DropDownItem;
