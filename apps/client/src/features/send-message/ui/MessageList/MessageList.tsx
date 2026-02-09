import { Message } from '@/shared/types'
import ChatForm from '@/features/chat-form/ui/ChatForm/ChatForm'
import ShowImageModal from '@/shared/ui/ShowImagePhoto/ShowImageModal'
import { Slider } from '@/shared/ui/Slider/Slider'
import ImageViewerToolbar from '@/shared/ui/ImageViewerToolbar/ImageViewerToolbar'
import MessageItem from '../MessageItem/MessageItem'
import { useMessageList } from '../../model/hooks/useMessageList'
import { useImageModal } from '../../model/hooks/useImageModal'
import { AnimatePresence } from 'framer-motion'
import { NoMessages } from '@/shared/ui/NoMessages/NoMessages'
import { useChatMessages } from '@/shared/api/queries/useChatMessages'
import { ArrowDown } from '@/shared/assets/icons'
import { useCallback, useEffect, useState } from 'react'
import clsx from 'clsx'
import { EmptyAvatar } from '@/shared/ui/empty-avatar'
import { useGetCompanionQuery } from '@/features/add-chat/api/add-companion.api'
import { useUserOnline } from '@/features/find-rooms/model/hooks/useUserOnline'

const MessageList = () => {
  const [isVisible, setIsVisible] = useState(false)
  const { roomId, containerRef, loaderRef } = useMessageList()
  const { messages, loading, hasMore } = useChatMessages(roomId!)
  const { data: companion } = useGetCompanionQuery(roomId!, { skip: !roomId })
  const { data } = useUserOnline()
  const {
    isOpen,
    setIsOpen,
    roomImages,
    imageIndex,
    resetModal,
    handleOpenModal,
  } = useImageModal(roomId!)

  const handleScroll = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    setIsVisible(container.scrollTop < -100)
  }, [containerRef])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => container.removeEventListener('scroll', handleScroll)
  }, [handleScroll, containerRef])

  const handleScrollDown = () => {
    containerRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <div className="relative mx-auto w-full md:w-[90%] xl:w-[60%] grow">
      {roomId && <ChatForm />}

      <div
        className={clsx(
          'w-full flex flex-col-reverse overflow-y-auto scrollbar-hide px-[15px] touch-pan-y',
          'h-[calc(100vh-155px)]'
        )}
        ref={containerRef}
      >
        <AnimatePresence initial={false}>
          {messages?.map((item: Message) => (
            <MessageItem
              item={item}
              key={item.id}
              setOpenImage={handleOpenModal}
            />
          ))}
        </AnimatePresence>

        {hasMore && (
          <div ref={loaderRef} className="py-4 text-center text-neutral-400">
            <p className="text-sm animate-pulse">Loading...</p>
          </div>
        )}

        {!loading && messages.length === 0 && (
          <EmptyAvatar
            avatar={companion?.user.profile.avatar as string}
            name={companion?.user.name}
            status={companion?.userId ? !!data?.[companion?.userId] : false}
          />
        )}

        {isVisible && (
          <button
            onClick={handleScrollDown}
            className={clsx(
              'fixed md:absolute z-20 flex items-center justify-center',
              'w-12 h-12 rounded-full shadow-lg transition-all duration-300',
              'bg-indigo-600 hover:bg-indigo-500 text-white',
              'right-4 bottom-24 md:-right-16 md:bottom-20'
            )}
          >
            <ArrowDown className="w-6 h-6" />
          </button>
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
    </div>
  )
}

export default MessageList
