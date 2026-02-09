import { EmojiIcon, PaperPlaneIcon } from '@/shared/assets/icons'
import { useChatFormLogic } from '@/features/send-message/model/hooks/useChatFormLogic'
import EmojiPicker, { Theme } from 'emoji-picker-react'
import PopoverCustom from '@/shared/ui/Popover/PopoverCustom'
import MessageTextarea from '../MessageTextarea/MessageTextarea'
import { useChatFormController } from '@/features/send-message/model/hooks/useChatFormController'
import UploadImageInput from '../UploadImageInput/UploadImageInput'
import { useGetCurrentUserQuery } from '@/features/auth/api/auth.api'
import clsx from 'clsx'

const ChatForm = () => {
  const { data: currentUser } = useGetCurrentUserQuery()
  const {
    formProps: { handleSubmit, register, textAreaRef },
    emoji: { handleEmojiClick },
  } = useChatFormLogic()

  const {
    edit: { editMessageId, editRegister, handleSubmitEdit },
    typingArgs: { roomId, handleTyping },
  } = useChatFormController()

  return (
    <div className="absolute bottom-0 left-0 w-full px-2.5 md:px-[15px] flex items-baseline gap-x-5 z-20">
      <form
        id="sendMessageForm"
        className={clsx(
          'flex items-center w-full mb-2.5 p-[5px] gap-x-2.5 border rounded-[14px]',
          'border-[#3d3d3d] bg-[#1e2124]'
        )}
        onSubmit={editMessageId ? handleSubmitEdit : handleSubmit}
      >
        <PopoverCustom
          trigger={
            <div className="cursor-pointer hover:opacity-80 transition-opacity flex items-center text-white">
              <EmojiIcon width="30" height="30" />
            </div>
          }
        >
          <EmojiPicker
            searchDisabled
            lazyLoadEmojis
            theme={Theme.AUTO}
            onEmojiClick={handleEmojiClick}
          />
        </PopoverCustom>

        <div className="flex-grow min-w-0">
          {!editMessageId ? (
            <MessageTextarea
              placeholder="Message"
              name="text"
              register={register}
              textAreaRef={textAreaRef}
              className="w-full bg-transparent resize-none overflow-hidden outline-none border-none transition-[height] duration-200 py-1 text-white placeholder-neutral-500"
              typingCallback={() =>
                handleTyping(roomId as string, currentUser?.id as string)
              }
            />
          ) : (
            <MessageTextarea
              name="editMessage"
              register={editRegister}
              textAreaRef={textAreaRef}
              className="w-full bg-transparent resize-none overflow-hidden outline-none border-none transition-[height] duration-200 py-1 text-indigo-400 font-medium"
              typingCallback={() =>
                handleTyping(roomId as string, currentUser?.id as string)
              }
            />
          )}
        </div>

        <UploadImageInput />
      </form>

      <button
        form="sendMessageForm"
        className={clsx(
          'flex items-center justify-center p-2 rounded-full transition-all duration-200 shrink-0 mb-2',
          'bg-[#3793cc] hover:bg-[#4485ad] text-white active:scale-95 shadow-md'
        )}
      >
        <PaperPlaneIcon width="25" height="25" />
      </button>
    </div>
  )
}

export default ChatForm
