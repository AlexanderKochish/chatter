import { useJoinRoom } from '@/features/join-room/model/useJoinRoom'
import { useMatchMedia } from '@/shared/hooks/useMatchMedia'
import { useRedirectIfUnauthorized } from '@/shared/api/queries/useRedirectIfUnauthorized'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setIsActive, toggleIsActive } from '../store/chat-layout.api'
import { RootState } from '@/app/store/store'
import { useGetCurrentUserQuery } from '@/features/auth/api/auth.api'
import { useNavigate, useParams } from 'react-router-dom'

export const useChatLayoutLogic = () => {
  const { joinRoom } = useJoinRoom()
  const { data, isError } = useGetCurrentUserQuery()
  const navigate = useNavigate()
  const param = useParams()
  const dispatch = useDispatch()
  const isActive = useSelector((state: RootState) => state.chatLayout.isActive)

  const { isMobile } = useMatchMedia()
  useRedirectIfUnauthorized(!!data?.id, isError)

  useEffect(() => {
    if (isMobile) {
      dispatch(setIsActive(!!param))
    }
  }, [isMobile, param, setIsActive])

  const findMyChat = (id: string) => {
    navigate(`/chat/${id}`)
    dispatch(toggleIsActive())
  }

  useEffect(() => {
    if (param.roomId) {
      joinRoom(param.roomId as string)
    }
  }, [param.roomId, joinRoom])

  return {
    isActive,
    isMobile,
    findMyChat,
    currentUser: data,
    roomId: param.roomId,
  }
}
