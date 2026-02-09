import {
  BadgeCheck,
  Bell,
  CreditCard,
  LogOut,
  Settings,
  User,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/shared/ui/drawer'
import { Button } from '@/shared/ui/button'
import { useLogOutMutation } from '@/features/auth/api/auth.api'
import { useNavigate } from 'react-router-dom'
import { ChevronsUpDown } from 'lucide-react'

interface NavUserProps {
  user: {
    name: string
    email: string
    avatar: string
  }
}

export function NavUserDrawer({ user }: NavUserProps) {
  const [logOut, { isLoading }] = useLogOutMutation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logOut().unwrap()
      navigate('/sign-in', { replace: true })
    } catch (e) {
      console.error('Logout failed', e)
    }
  }

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <button className="flex w-full items-center gap-3">
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col flex-1 overflow-hidden">
            <span className="">{user.name}</span>
            <span className="">{user.email}</span>
          </div>

          <ChevronsUpDown className="size-4 shrink-0 opacity-40 text-muted-foreground" />
        </button>
      </DrawerTrigger>

      <DrawerContent className="fixed inset-y-0 right-0 z-50 flex h-full w-[320px] flex-col border-l bg-background shadow-2xl outline-none">
        <DrawerHeader className="border-b p-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <Avatar className="h-20 w-20 rounded-2xl border-4 border-muted shadow-sm">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-2xl">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <DrawerTitle className="text-xl font-semibold">
                {user.name}
              </DrawerTitle>
              <DrawerDescription>{user.email}</DrawerDescription>
            </div>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid gap-2">
            <MenuAction icon={<User size={18} />} label="Profile Details" />
            <MenuAction
              icon={<BadgeCheck size={18} />}
              label="Account Verification"
            />
            <MenuAction
              icon={<Bell size={18} />}
              label="Notifications"
              count={5}
            />
            <div className="my-4 h-px bg-border" />
            <MenuAction
              icon={<Settings size={18} />}
              label="Interface Settings"
            />
            <MenuAction icon={<CreditCard size={18} />} label="Billing" />
          </div>
        </div>

        <DrawerFooter className="border-t p-4">
          <Button
            variant="destructive"
            className="w-full justify-start gap-3 h-12"
            onClick={handleLogout}
            disabled={isLoading}
          >
            <LogOut size={18} />
            {isLoading ? 'Logging out...' : 'Logout'}
          </Button>
          <DrawerClose asChild>
            <Button variant="ghost" className="w-full">
              Back to Chat
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function MenuAction({
  icon,
  label,
  count,
}: {
  icon: any
  label: string
  count?: number
}) {
  return (
    <button className="flex w-full items-center gap-4 rounded-md px-3 py-3 text-sm font-medium transition-colors hover:bg-muted active:bg-muted/80">
      <span className="text-muted-foreground">{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      {count && (
        <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
          {count}
        </span>
      )}
    </button>
  )
}
