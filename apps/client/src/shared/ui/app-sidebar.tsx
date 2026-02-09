'use client'

import * as React from 'react'
import { useParams } from 'react-router-dom'

import { NavUserDrawer } from '@/shared/ui/nav-user'
import { Label } from '@/shared/ui/label'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/shared/ui/sidebar'
import { Switch } from '@/shared/ui/switch'

import { useChatLayoutLogic } from '@/features/chat-layout/model/hooks/useChatLayoutLogic'

import { ChatRoomResponse } from '@/shared/types'
import { useFindChatsQuery } from '@/features/find-rooms/api/find-rooms.api'
import { useUserOnline } from '@/features/find-rooms/model/hooks/useUserOnline'
import { useDebounce } from '../hooks/useDebounce'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { findMyChat, currentUser } = useChatLayoutLogic()
  const { data: chats } = useFindChatsQuery()
  const { roomId } = useParams()
  const { data: onlineStatus } = useUserOnline()

  const { setOpen } = useSidebar()

  const [searchQuery, setSearchQuery] = React.useState('')

  const { debounceValue } = useDebounce({ delay: 300, value: searchQuery })

  const filteredChats = React.useMemo(() => {
    if (!chats) return []

    let result = [...chats]

    if (debounceValue) {
      result = result.filter((chat) => {
        const companion = chat.members?.find(
          (m) => m.userId !== currentUser?.id
        )
        const nameMatch = companion?.user.name
          .toLowerCase()
          .includes(debounceValue.toLowerCase())
        const messageMatch = chat.messages[0]?.text
          .toLowerCase()
          .includes(debounceValue.toLowerCase())
        return nameMatch || messageMatch
      })
    }

    return result.sort((a, b) => {
      const dateA = a.messages[0]?.createdAt
        ? new Date(a.messages[0].createdAt).getTime()
        : 0
      const dateB = b.messages[0]?.createdAt
        ? new Date(b.messages[0].createdAt).getTime()
        : 0

      return dateB - dateA
    })
  }, [chats, debounceValue, currentUser?.id])

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      {...props}
    >
      <Sidebar
        collapsible="none"
        className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  {currentUser && (
                    <NavUserDrawer
                      user={{
                        name: currentUser.name,
                        email: currentUser.email,
                        avatar: currentUser.profile?.avatar as string,
                      }}
                    />
                  )}
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
      </Sidebar>

      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-foreground text-base font-medium">
              Messages
            </div>
            <Label className="flex items-center gap-2 text-sm">
              <span>Online</span>
              <Switch className="shadow-none" />
            </Label>
          </div>
          <SidebarInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chats..."
          />
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              {filteredChats.map((chat: ChatRoomResponse) => {
                const companion = chat.members?.find(
                  (m) => m.userId !== currentUser?.id
                )
                const lastMessage = chat.messages[0]
                if (!companion) return null
                return (
                  <button
                    key={chat.id}
                    onClick={() => {
                      findMyChat(chat.id)
                      setOpen(true)
                    }}
                    className={`
                      w-full flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight transition-colors hover:bg-sidebar-accent
                      ${chat.id === roomId ? 'bg-sidebar-accent' : ''}
                    `}
                  >
                    <div className="flex w-full items-center gap-2">
                      <div className="relative">
                        <img
                          src={
                            (companion.user.profile.avatar as string) ||
                            '/user_placeholder.webp'
                          }
                          className="size-8 rounded-full object-cover"
                          alt={companion.user.name}
                        />
                        {onlineStatus?.[companion.userId] && (
                          <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white bg-green-500" />
                        )}
                      </div>
                      <span className="font-semibold text-foreground">
                        {companion.user.name}
                      </span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {/* Здесь можно добавить форматирование даты сообщения */}
                      </span>
                    </div>

                    <span className="line-clamp-2 w-full text-xs text-muted-foreground text-left">
                      {lastMessage?.text ?? 'No messages yet'}
                    </span>
                  </button>
                )
              })}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  )
}
