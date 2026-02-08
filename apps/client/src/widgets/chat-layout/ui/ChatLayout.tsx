import s from './ChatLayout.module.css'
// import clsx from 'clsx'
// import MessageHeader from '@/widgets/chat-header/ui/message-header/MessageHeader'
// import ChatSidebar from '@/widgets/chat-sidebar/ui/ChatSidebar'
// import ChatRoom from '@/widgets/chat-room/ui/ChatRoom'
// import { useChatLayoutLogic } from '@/features/chat-layout/model/hooks/useChatLayoutLogic'

// const ChatLayout = () => {
//   const { isMobile, isActive } = useChatLayoutLogic()

//   const clazz = clsx(s.chatContent, isMobile && s.mobile)
//   const chatListClass = clsx(s.chatList, isMobile && isActive && s.hidden)
//   const roomClass = clsx(s.roomContent, isMobile && !isActive && s.hidden)

//   return (
//     <div className={clazz}>
//       <ChatSidebar chatListClass={chatListClass} />
//       <MessageHeader />
//       <ChatRoom roomClass={roomClass} />
//     </div>
//   )
// }

// export default ChatLayout
import { useChatLayoutLogic } from '@/features/chat-layout/model/hooks/useChatLayoutLogic'
import { AppSidebar } from '@/shared/ui/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/ui/breadcrumb'
import { Separator } from '@/shared/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/shared/ui/sidebar'
import ChatRoom from '@/widgets/chat-room/ui/ChatRoom'
import clsx from 'clsx'

export default function ChatLayout() {
  const { isMobile, isActive } = useChatLayoutLogic()
  const roomClass = clsx(s.roomContent, isMobile && !isActive && s.hidden)
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '350px',
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">All Inboxes</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Inbox</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <ChatRoom roomClass={roomClass} />
      </SidebarInset>
    </SidebarProvider>
  )
}
