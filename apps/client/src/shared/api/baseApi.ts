import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_API_URL } from './constants'

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_API_URL || 'http://localhost:3000/api',
    credentials: 'include',
  }),
  tagTypes: ['users', 'chat', 'messages', 'profile', 'addCompanion', 'online'],
  endpoints: () => ({}),
})
