import s from "./MessageList.module.css";
import { Message } from "@shared/types";
import ChatForm from "@features/chat-form/ui/ChatForm/ChatForm";
import ShowImageModal from "@shared/ui/ShowImagePhoto/ShowImageModal";
import { Slider } from "@shared/ui/Slider/Slider";
import ImageViewerToolbar from "@shared/ui/ImageViewerToolbar/ImageViewerToolbar";
import MessageItem from "../MessageItem/MessageItem";
import { useMessageList } from "../../model/hooks/useMessageList";
import { useImageModal } from "../../model/hooks/useImageModal";
import { ArrowDown } from "@shared/assets/icons";
import { useCallback, useEffect, useState } from "react";
import { useChatMessagesStore } from "../../model/store/chatMessage.store";
import { AnimatePresence } from "framer-motion";

const MessageList = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { roomId, containerRef, loaderRef } = useMessageList();
  const { messages, hasMore, loading } = useChatMessagesStore();
  const {
    isOpen,
    setIsOpen,
    roomImages,
    imageIndex,
    resetModal,
    handleOpenModal,
  } = useImageModal(roomId);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const isAtBottom = container.scrollTop <= 15;

    setIsVisible(!isAtBottom);
  }, [containerRef]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => container.removeEventListener("scroll", handleScroll);
  }, [containerRef, handleScroll]);

  const handleScrollDown = () => {
    containerRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className={s.chatWrapper}>
      {roomId && <ChatForm />}
      <div className={s.chatMessagge} ref={containerRef}>
        <AnimatePresence initial={false}>
          {messages?.map((item: Message) => (
            <MessageItem
              item={item}
              key={item.id}
              setOpenImage={handleOpenModal}
            />
          ))}
        </AnimatePresence>
        {hasMore || loading ? (
          <div
            ref={loaderRef}
            className={!messages.length ? s.notMore : s.hasMore}
          >
            Loading...
          </div>
        ) : (
          ""
        )}
        <ShowImageModal
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          nav={
            <ImageViewerToolbar
              imageIndex={imageIndex}
              onModalReset={resetModal}
              roomImages={roomImages ?? []}
            />
          }
        >
          <Slider slides={roomImages ?? []} initialSlide={imageIndex} />
        </ShowImageModal>
      </div>
      {isVisible && (
        <button className={s.btnGoDown} onClick={handleScrollDown}>
          <ArrowDown width="25" height="25" />
        </button>
      )}
    </div>
  );
};

export default MessageList;
