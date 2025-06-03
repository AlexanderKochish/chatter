import { Dispatch, ReactElement, ReactNode, SetStateAction } from "react";
import { DropdownMenu } from "radix-ui";
import s from "./DropdownMenu.module.css";

type Props = {
  trigger?: ReactElement;
  children: ReactNode;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  isOpen?: boolean;
  anchorEl?: HTMLElement | null;
  position?: { x: number; y: number };
};
const DropdownMenuCustom = ({
  trigger,
  children,
  setIsOpen,
  isOpen,
  anchorEl,
  position,
}: Props) => {
  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
      {trigger && (
        <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
      )}
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={s.content}
          sideOffset={5}
          style={
            anchorEl && position
              ? {
                  position: "absolute",
                  top: position.y,
                  left: position.x,
                }
              : undefined
          }
        >
          <DropdownMenu.Arrow className={s.arrow} />
          {children}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default DropdownMenuCustom;
