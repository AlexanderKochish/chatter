import { baseApi } from "@/shared/api/baseApi";
import { CHAT_PARAMS } from "@/shared/api/constants";
import { MessageImage } from "@/shared/types";

export const imageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChatImages: builder.query<MessageImage[], string>({
      query: (chatId) => {
        if(!chatId){
          throw new Error('Chat ID is required')
        }
        return {
          url: `${CHAT_PARAMS}/${chatId}/images`,
        }
        
      },
    }),
  }),
});

export const { useGetChatImagesQuery } = imageApi;
