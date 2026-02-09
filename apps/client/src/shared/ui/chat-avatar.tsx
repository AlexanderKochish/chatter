import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { PersonIcon } from '../assets/icons'
import { cn } from '../lib/utils/class-names'

interface ChatAvatarProps {
  src?: string | null
  isOnline?: boolean
  className?: string
}

export const ChatAvatar = ({ src, isOnline, className }: ChatAvatarProps) => {
  if (!src) {
    return (
      <div className={cn('relative inline-flex', className)}>
        <Avatar className="size-12">
          <PersonIcon className="w-12.5 h-12.5" />
        </Avatar>

        <span
          className={cn(
            'absolute bottom-0 right-0 size-3.5 rounded-full border-2 border-white dark:border-slate-950',
            isOnline ? 'bg-green-500' : 'bg-slate-400'
          )}
          aria-hidden="true"
        />
      </div>
    )
  }

  return (
    <div className={cn('relative inline-flex', className)}>
      <Avatar className="size-12">
        <AvatarImage src={src} alt="avatar" className="object-cover" />
        <AvatarFallback className="bg-slate-200">
          <PersonIcon />
        </AvatarFallback>
      </Avatar>

      <span
        className={cn(
          'absolute bottom-0 right-0 size-3.5 rounded-full border-2 border-white dark:border-slate-950',
          isOnline ? 'bg-green-500' : 'bg-slate-400'
        )}
        aria-hidden="true"
      />
    </div>
  )
}
