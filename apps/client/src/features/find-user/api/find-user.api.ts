import { baseApi } from "@/shared/api/baseApi";
import { USERS_PARAMS } from "@/shared/api/constants";
import { User } from "@/shared/types";

const apiFindUser = baseApi.injectEndpoints({
    endpoints: (build) => ({
        findUser: build.query<User[], string>({
            query: (search) => ({
                url: USERS_PARAMS,
                params: {
                    search
                }
            })
        }),
        findUserOnline: build.query<User[], string[]>({
            query: (usersIds) => ({
                url: `${USERS_PARAMS}/online`,
                method: 'POST',
                body: {data: {usersIds}}
            })
        })
    })
})

export const { useFindUserQuery, useFindUserOnlineQuery } = apiFindUser;