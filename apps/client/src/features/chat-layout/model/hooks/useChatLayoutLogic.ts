import { useJoinRoom } from "@/features/join-room/model/useJoinRoom";
import { useSearchQuery } from "@/shared/hooks/useSearchQuery";
import { useMatchMedia } from "@/shared/hooks/useMatchMedia";
import { useRedirectIfUnauthorized } from "@/shared/api/queries/useRedirectIfUnauthorized";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsActive, toggleIsActive } from "../store/chat-layout.api";
import { RootState } from "@/app/store/store";
import { useGetCurrentUserQuery } from "@/features/auth/api/auth.api";

export const useChatLayoutLogic = () => {
  const { joinRoom } = useJoinRoom();
  const { data, isError } = useGetCurrentUserQuery()
  const { param, setSearchParams } = useSearchQuery("chatId");
  const dispatch = useDispatch()
  const isActive = useSelector((state: RootState) => state.chatLayout.isActive)

  const { isMobile } = useMatchMedia();
  useRedirectIfUnauthorized(!!data?.id, isError);

  useEffect(() => {
    if (isMobile) {
      dispatch(setIsActive(!!param));
    }
  }, [isMobile, param, setIsActive]);

  const findMyChat = (id: string) => {
    setSearchParams(id);
    dispatch(toggleIsActive());
  };

  useEffect(() => {
    if (param) {
      joinRoom(param);
    }
  }, [param, joinRoom]);

  return {
    isActive,
    isMobile,
    findMyChat,
    currentUser: data,
    roomId: param,
  };
};
