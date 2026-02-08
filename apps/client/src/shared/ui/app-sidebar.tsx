'use client'

import * as React from 'react'
import { Command } from 'lucide-react'
import { useParams } from 'react-router-dom'

import { NavUser } from '@/shared/ui/nav-user'
import { Label } from '@/shared/ui/label'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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

// Ваши хуки и типы
import { useChatLayoutLogic } from '@/features/chat-layout/model/hooks/useChatLayoutLogic'

import { ChatRoomResponse } from '@/shared/types'
import { useFindChatsQuery } from '@/features/find-rooms/api/find-rooms.api'
import { useUserOnline } from '@/features/find-rooms/model/hooks/useUserOnline'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // 1. Логика из ChatRoomList
  const { findMyChat, currentUser } = useChatLayoutLogic()
  const { data: chats } = useFindChatsQuery()
  const { roomId } = useParams()
  const { data: onlineStatus } = useUserOnline(chats, currentUser!)

  const { setOpen } = useSidebar()

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      {...props}
    >
      {/* Первая панель (узкая, с иконками или категориями) */}
      <Sidebar
        collapsible="none"
        className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <a href="#">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Command className="size-4" />
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          {/* Здесь можно оставить иконки навигации, если они нужны */}
        </SidebarContent>

        <SidebarFooter>
          {currentUser && (
            <NavUser
              user={{
                name: currentUser.name,
                email: currentUser.email,
                avatar: currentUser.profile?.avatar as string,
              }}
            />
          )}
        </SidebarFooter>
      </Sidebar>

      {/* Вторая панель (Список чатов) */}
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
          <SidebarInput placeholder="Search chats..." />
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              {chats?.map((chat: ChatRoomResponse) => {
                // Находим собеседника (того, кто не является текущим пользователем)
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
