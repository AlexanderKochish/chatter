import { ReactNode } from "react";
import { Dialog } from "radix-ui";
import s from "./Modal.module.css";
import { CloseIcon } from "../../assets/icons";

type Props = {
  children?: ReactNode;
  position: string;
  title?: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const DialogModal = ({
  isOpen,
  setIsOpen,
  children,
  position = "50",
  title,
}: Props) => (
  <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
    <Dialog.Portal>
      <Dialog.Overlay className={s.overlay} onClick={() => setIsOpen(false)} />
      <Dialog.Content
        onClick={(e) => e.stopPropagation()}
        style={{ top: `${position}%` }}
        className={s.content}
      >
        <Dialog.Title className={s.title}>{title}</Dialog.Title>
        <Dialog.Description className={s.description}></Dialog.Description>
        {children}
        <Dialog.Close asChild>
          <button className={s.iconButton} aria-label="Close">
            <CloseIcon />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default DialogModal;
