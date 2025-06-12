// useChatMessages.ts
import { useLazyGetChatMessagesQuery } from '@/features/send-message/api/chat.api';
import {
  addNewMessage,
  appendPage,
  removeMessage,
  resetChat,
  updateMessage,
} from '@/features/send-message/model/store/chat.slice';
import { useMessageSocketEvents } from '@/features/send-message/model/hooks/useMessageSocketEvents';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';

export const useChatMessages = (roomId: string) => {
  const dispatch = useDispatch();
  const pages = useSelector((state: RootState) => state.chat.pages);
  const nextCursor = useSelector((state: RootState) => state.chat.nextCursor);
  const [fetchMessages, { isFetching }] = useLazyGetChatMessagesQuery();

  useEffect(() => {
    if (!roomId) return;
    dispatch(resetChat());
    fetchMessages({ roomId }).then((res) => {
      if ('data' in res && res.data) {
        dispatch(appendPage(res.data));
      }
    });
  }, [roomId]);

  const fetchMore = () => {
    if (nextCursor) {
      fetchMessages({ roomId, cursor: nextCursor }).then((res) => {
        if ('data' in res && res.data) {
          dispatch(appendPage(res.data));
        }
      });
    }
  };

  useMessageSocketEvents(roomId, 'newMessage', (message) => {
    dispatch(addNewMessage(message));
  });

  useMessageSocketEvents(roomId, 'updateMessage', (message) => {
    dispatch(updateMessage(message));
  });

  useMessageSocketEvents(roomId, 'removeMessage', (message) => {
    dispatch(removeMessage(message.id));
  });

const allMessages = pages.flat();
const uniqueMessages = Array.from(
  new Map(allMessages.map((msg) => [msg.id, msg])).values()
);

  return {
    messages: uniqueMessages,
    hasMore: !!nextCursor,
    fetchMore,
    loading: isFetching,
  };
};
