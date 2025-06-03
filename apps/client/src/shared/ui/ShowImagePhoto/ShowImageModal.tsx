import { Dialog, VisuallyHidden } from "radix-ui";
import s from "./ShowImageModal.module.css";
import { ReactElement, ReactNode } from "react";

type Props = {
  children?: ReactNode;
  title?: ReactElement;
  nav?: ReactNode;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const ShowImageModal = ({ children, title, nav, isOpen, setIsOpen }: Props) => (
  <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
    <Dialog.Portal>
      <Dialog.Overlay className={s.overlay} onClick={() => setIsOpen(false)} />
      <Dialog.Content
        className={s.content}
        onClick={(e) => e.stopPropagation()}
      >
        {nav && <div className={s.nav}>{nav}</div>}
        <div className={s.sliderWrapper}>{children}</div>
        <VisuallyHidden.Root>
          <Dialog.Title className={s.title}>{title}</Dialog.Title>
        </VisuallyHidden.Root>
        <VisuallyHidden.Root>
          <Dialog.Description className={s.description} />
        </VisuallyHidden.Root>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default ShowImageModal;
