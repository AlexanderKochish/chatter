import { Avatar, AvatarFallback, AvatarImage } from './avatar'
import { Button } from './button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from './empty'
import clsx from 'clsx'

interface Props {
  avatar?: string
  name?: string
  email?: string
  status?: boolean
  onAction?: () => void // Добавим колбэк для кнопки
}

export function EmptyAvatar({ avatar, name, email, status, onAction }: Props) {
  // Получаем инициалы для Fallback
  const initials =
    name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || '??'

  return (
    <Empty className="flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in duration-300">
      <EmptyHeader className="flex flex-col items-center">
        <EmptyMedia variant="default" className="relative mb-4">
          <Avatar className="size-20 border-2 border-background shadow-xl">
            <AvatarImage
              src={avatar}
              className={clsx(
                'object-cover transition-all',
                !status && 'grayscale opacity-80'
              )}
            />
            <AvatarFallback className="bg-muted text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>

          <span
            className={clsx(
              'absolute bottom-1 right-1 size-4 rounded-full border-2 border-background',
              status ? 'bg-green-500 animate-pulse' : 'bg-neutral-500'
            )}
          />
        </EmptyMedia>

        <EmptyTitle className="text-2xl font-bold tracking-tight">
          {name || 'Unknown User'}
        </EmptyTitle>

        <EmptyDescription className="max-w-[250px] text-center mt-2 text-white">
          {status ? (
            <span className="text-green-500 font-medium">
              Online and ready to chat
            </span>
          ) : (
            `This user is currently offline. You can leave a message to notify him.`
          )}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
