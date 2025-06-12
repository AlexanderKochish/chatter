// chat.api.ts
import { baseApi } from '@/shared/api/baseApi';
import { CHAT_PARAMS } from '@/shared/api/constants';
import { ChatPage } from '@/shared/types';

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChatMessages: builder.query<ChatPage, { roomId: string; cursor?: string }>({
      query: ({ roomId, cursor }) => {
        const params = new URLSearchParams();
        if (cursor) params.set('cursor', cursor);
        return `${CHAT_PARAMS}/${roomId}?${params}`;
      },
    }),
  }),
});

export const { useLazyGetChatMessagesQuery } = chatApi;
