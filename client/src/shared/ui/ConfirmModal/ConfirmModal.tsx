import { ReactNode } from "react";
import { Dialog } from "radix-ui";
import s from "./ConfirmModal.module.css";
import { CloseIcon } from "@shared/assets/icons";
import Button from "../Button/Button";
import { UseMutateFunction } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

type Props = {
  children?: ReactNode;
  position: string;
  title?: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  mutate: UseMutateFunction<
    AxiosResponse<any> | undefined,
    Error,
    void,
    unknown
  >;
};

const ConfirmModal = ({
  isOpen,
  setIsOpen,
  children,
  position = "50",
  title,
  mutate,
}: Props) => (
  <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
    <Dialog.Portal>
      <Dialog.Overlay className={s.overlay} onClick={() => setIsOpen(false)} />
      <Dialog.Content style={{ top: `${position}%` }} className={s.content}>
        <Dialog.Title className={s.title}>{title}</Dialog.Title>
        <Dialog.Description className={s.description}></Dialog.Description>
        <div className={s.logoutContent}>
          <span>{children}</span>

          <div className={s.logoutBtns}>
            <Button onClick={() => setIsOpen(false)}>No</Button>
            <Button color={"danger"} size="large" onClick={() => mutate()}>
              Yes
            </Button>
          </div>
        </div>

        <Dialog.Close asChild>
          <button className={s.iconButton} aria-label="Close">
            <CloseIcon />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default ConfirmModal;
