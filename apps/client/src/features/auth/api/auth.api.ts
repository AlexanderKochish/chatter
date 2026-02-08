import { baseApi } from '@/shared/api/baseApi'
import { SignInSchemaType, SignUpSchemaType } from '../model/zod/auth.schema'
import {
  LOGOUT,
  PROFILE_PARAMS,
  SIGN_IN_PARAMS,
  SIGN_UP_PARAMS,
} from '@/shared/api/constants'
import { User } from '@/shared/types'

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signUp: builder.mutation<User, SignUpSchemaType>({
      query: (data: SignUpSchemaType) => ({
        url: SIGN_UP_PARAMS,
        method: 'POST',
        body: data,
      }),
    }),
    signIn: builder.mutation<User, SignInSchemaType>({
      query: (data: SignInSchemaType) => ({
        url: SIGN_IN_PARAMS,
        method: 'POST',
        body: data,
      }),
    }),
    logOut: builder.mutation<void, void>({
      query: () => ({
        url: LOGOUT,
        method: 'POST',
      }),
    }),
    getCurrentUser: builder.query<User, void>({
      query: () => `${PROFILE_PARAMS}/me`,
      providesTags: ['profile'],
    }),
  }),
})

export const {
  useGetCurrentUserQuery,
  useLogOutMutation,
  useSignInMutation,
  useSignUpMutation,
} = authApi
