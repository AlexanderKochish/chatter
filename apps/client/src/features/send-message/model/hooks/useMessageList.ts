import { useEffect } from 'react'
import { useChatMessages } from '@/shared/api/queries/useChatMessages'
import { useIntersectionObserver } from '@/shared/hooks/useIntersectionObserver'
import { useParams } from 'react-router-dom'

export const useMessageList = () => {
  const { roomId } = useParams()
  const { fetchMore, loading, hasMore } = useChatMessages(roomId as string)

  const { containerRef, loaderRef } = useIntersectionObserver({
    hasMore,
    loading,
    fetchMore,
  })

  useEffect(() => {
    if (!roomId) return
  }, [roomId])

  return {
    containerRef,
    loaderRef,
    roomId,
  }
}
