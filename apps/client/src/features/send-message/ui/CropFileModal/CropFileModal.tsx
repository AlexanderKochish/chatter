import { ReactNode } from "react";
import { Dialog } from "radix-ui";
import s from "./CropFileModal.module.css";
import { CloseIcon } from "@shared/assets/icons";

type Props = {
  trigger?: ReactNode;
  children?: ReactNode;
  position: string;
  title?: string;
  isOpen?: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const CropFileModal = ({
  trigger,
  children,
  position = "50",
  title,
  isOpen,
  setIsOpen,
}: Props) => (
  <Dialog.Root open={isOpen}>
    <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className={s.overlay} />
      <Dialog.Content style={{ top: `${position}%` }} className={s.content}>
        <Dialog.Title className={s.title}>{title}</Dialog.Title>
        <Dialog.Description className={s.description}></Dialog.Description>
        {children}
        <Dialog.Close onClick={() => setIsOpen(!isOpen)} asChild>
          <button className={s.iconButton} aria-label="Close">
            <CloseIcon />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default CropFileModal;
