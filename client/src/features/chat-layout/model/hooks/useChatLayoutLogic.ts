import { useJoinRoom } from "@/features/join-room/model/useJoinRoom";
import { useProfile } from "@/shared/api/queries/useProfile";
import { useSearchQuery } from "@/shared/hooks/useSearchQuery";
import { useChatLayoutStore } from "../store/useChatLayoutStore";
import { useMatchMedia } from "@/shared/hooks/useMatchMedia";
import { useRedirectIfUnauthorized } from "@/shared/api/queries/useRedirectIfUnauthorized";
import { useEffect } from "react";

export const useChatLayoutLogic = () => {
  const { joinRoom } = useJoinRoom();
  const { me, isError } = useProfile();
  const { param, setSearchParams } = useSearchQuery("chatId");
  const { isActive, toggleIsActive, setIsActive } = useChatLayoutStore();

  const { isMobile } = useMatchMedia();
  useRedirectIfUnauthorized(!!me?.id, isError);

  useEffect(() => {
    if (isMobile) {
      setIsActive(!!param);
    }
  }, [isMobile, param, setIsActive]);

  const findMyChat = (id: string) => {
    setSearchParams(id);
    toggleIsActive();
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
    me,
    roomId: param,
  };
};
