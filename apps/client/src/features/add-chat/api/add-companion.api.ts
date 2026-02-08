import { baseApi } from "@/shared/api/baseApi";
import { CHAT_PARAMS } from "@/shared/api/constants";
import { Members, User } from "@/shared/types";

const apiAddCompanion = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addCompanion: build.mutation<User, { targetUserId: string }>({
      query: ({ targetUserId }) => ({
        url: `${CHAT_PARAMS}/create`,
        method: "POST",
        body: { data: { targetUserId } },
      }),
      invalidatesTags: () => [{ type: "addCompanion" }],
    }),
    getCompanion: build.query<Members, string>({
      query: (roomId) => {
        if(!roomId) {
          throw new Error("Room ID is required");
        }
        return {
            url: `${CHAT_PARAMS}/${roomId}/companion`,
        }
       
      },
    }),
  }),
});

export const { useAddCompanionMutation, useGetCompanionQuery } =
  apiAddCompanion;
