import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    credentials: 'include',
  }),
  tagTypes: ['users', 'chat', 'messages', 'profile', 'addCompanion', 'online'],
  endpoints: () => ({}),
})
