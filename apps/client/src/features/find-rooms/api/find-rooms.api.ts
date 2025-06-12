import { baseApi } from "@/shared/api/baseApi";
import { CHAT_PARAMS } from "@/shared/api/constants";
import { ChatRoomResponse } from "@/shared/types";

const apiFindChats = baseApi.injectEndpoints({
    endpoints: (build) => ({
        findChats: build.query<ChatRoomResponse[], void>({
            query: () => ({
                url: CHAT_PARAMS,
            })
        }),
        removeChat: build.mutation<void, string>({
            query: (chatId) => ({
                url: `${CHAT_PARAMS}/${chatId}/delete-chat`,
                method: 'DELETE'
            })
        })
    })
})


export const { useFindChatsQuery, useRemoveChatMutation } = apiFindChats;