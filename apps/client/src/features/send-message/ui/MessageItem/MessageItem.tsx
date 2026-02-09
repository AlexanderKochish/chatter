import clsx from 'clsx'
import { Message } from '@/shared/types'
import { LinkifiedText } from '@/shared/ui/LinkifiedText/LinkifiedText'
import { format } from 'date-fns'
import DropDownItem from '@/shared/ui/DropdownItem/DropDownItem'
import { BinIcon, CopyIcon, PencilIcon } from '@/shared/assets/icons'
import { MessageDropdown } from '@/shared/ui/MessageDropDown/MessageDropdown'
import { useSendMessage } from '../../model/hooks/useSendMessage'
import { useMessageContextMenu } from '../../model/hooks/useMessageContextMenu'
import { useChatLayoutLogic } from '@/features/chat-layout/model/hooks/useChatLayoutLogic'
import { motion } from 'framer-motion'
import { copyToClipboard } from '@/shared/lib/helpers/copyToClipboard'
import { useLongPress } from 'use-long-press'
import { MouseEvent, TouchEvent } from 'react'

type Props = {
  item: Message
  setOpenImage: (id: string) => void
}

const MessageItem = ({ item, setOpenImage }: Props) => {
  const { currentUser } = useChatLayoutLogic()
  const { removeMessage } = useSendMessage()
  const {
    openMessageId,
    dropdownPosition,
    handleEditMessage,
    onCloseMenu,
    edit,
  } = useMessageContextMenu()

  const isOpen = openMessageId === item.id
  const isOwn = item.ownerId === currentUser?.id

  const handleRemoveMessage = (item: Message) => {
    removeMessage({
      roomId: item.roomId,
      msgId: item.id,
      ownerId: item.ownerId,
    })
    onCloseMenu()
  }

  const longPressBind = useLongPress(
    (e) => {
      if ('touches' in e && e.touches.length > 0) {
        handleEditMessage(
          e as unknown as TouchEvent<HTMLDivElement>,
          item?.id as string,
          {
            clientX: e.touches[0].clientX,
            clientY: e.touches[0].clientY,
          }
        )
      } else if ('clientX' in e) {
        handleEditMessage(e as MouseEvent<HTMLDivElement>, item?.id)
      }
    },
    {
      threshold: 500,
      captureEvent: true,
      cancelOnMovement: true,
    }
  )

  return (
    <div
      onContextMenu={(e) => handleEditMessage(e, item.id)}
      className={clsx(
        'flex w-full relative touch-manipulation select-auto pointer-events-auto transition-colors duration-200',
        isOwn ? 'justify-end' : 'justify-start',
        isOpen && 'bg-black/40'
      )}
      tabIndex={0}
      role="button"
      {...longPressBind}
    >
      <motion.div
        className={clsx(
          'flex flex-col my-1 px-3 py-1.5 gap-1.5 shadow-md overflow-hidden max-w-[80%] md:max-w-[70%]',
          isOwn
            ? 'bg-violet-600 text-white rounded-[15px_0px_15px_15px]'
            : 'bg-neutral-800 text-neutral-100 rounded-[15px_15px_15px_0px]'
        )}
        initial={{ opacity: 0, x: isOwn ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: isOwn ? 20 : -20 }}
        transition={{ duration: 0.3 }}
      >
        <span className="break-words leading-relaxed">
          <LinkifiedText text={item.text} />
        </span>

        {item.images && item.images.length > 0 && (
          <div className="flex flex-col gap-2 mt-1">
            {item.images.map(({ id, url }) => (
              <div
                key={id}
                className="flex justify-center items-center overflow-hidden rounded-lg cursor-pointer"
                onClick={() => setOpenImage(id)}
                onKeyDown={(e) => e.key === 'Enter' && setOpenImage(id)}
                role="button"
                tabIndex={0}
              >
                <img
                  src={url}
                  alt="message"
                  className="max-w-full h-auto max-h-[60vh] object-contain block hover:scale-[1.02] transition-transform"
                />
              </div>
            ))}
          </div>
        )}

        <div
          className={clsx(
            'text-[10px] flex items-center justify-end gap-1.5 opacity-70',
            isOwn ? 'text-violet-100' : 'text-neutral-400'
          )}
        >
          {item.edited && (
            <span className="italic uppercase text-[9px]">edited</span>
          )}
          <span>{format(new Date(item.createdAt), 'hh:mm a')}</span>
        </div>
      </motion.div>

      <MessageDropdown
        isOpen={isOpen}
        position={dropdownPosition}
        onClose={onCloseMenu}
      >
        {isOwn && (
          <DropDownItem
            icon={<PencilIcon />}
            text="Edit"
            onClick={() => edit(item.id, item.text)}
          />
        )}
        <DropDownItem
          icon={<CopyIcon />}
          text="Copy"
          onClick={() => {
            copyToClipboard(item.text)
            onCloseMenu()
          }}
        />
        <DropDownItem
          icon={<BinIcon width="20" height="20" />}
          className="!text-red-500"
          text="Delete"
          onClick={() => handleRemoveMessage(item)}
        />
      </MessageDropdown>
    </div>
  )
}

export default MessageItem
