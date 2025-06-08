import axios, { AxiosError, AxiosResponse } from "axios";
import {
  SignInSchemaType,
  SignUpSchemaType,
} from "@features/auth/model/zod/auth.schema";
import {
  BASE_API_URL,
  CHAT_PARAMS,
  LOGOUT,
  PROFILE_PARAMS,
  SIGN_IN_PARAMS,
  SIGN_UP_PARAMS,
  USERS_PARAMS,
} from "./constants";
import { Message, MessageImage, UpdateProfile } from "@shared/types";

const api = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const handlerError = (error: unknown): never => {
  if (error instanceof AxiosError) {
    throw new Error(error.response?.data ?? error.message);
  }
  throw new Error("An expected error occurred");
};

const apiWrapper = async <T>(cb: () => Promise<T>): Promise<T> => {
  try {
    return await cb();
  } catch (error) {
    handlerError(error);
    throw error;
  }
};

const refreshTokens = async () => apiWrapper(() => api.post("/auth/refresh"));

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;
      try {
        await refreshTokens();
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(
          refreshError instanceof Error
            ? refreshError
            : new Error("Unexpected error during token refresh"),
        );
      }
    }

    return Promise.reject(
      error instanceof Error ? error : new Error("Unexpected error"),
    );
  },
);

// auth endpoints
export const signUp = async (data: SignUpSchemaType) => {
  return await apiWrapper(() =>
    api.post(SIGN_UP_PARAMS, data).then((res) => res.data),
  );
};

export const signIn = async (data: SignInSchemaType) => {
  return await apiWrapper(() =>
    api.post(SIGN_IN_PARAMS, data).then((res) => res.data),
  );
};

export const logout = async () => await apiWrapper(() => api.post(`${LOGOUT}`));

// profile endpoints
export const getMe = async () =>
  await apiWrapper(() => api.get(`${PROFILE_PARAMS}/me`));

export const updateProfile = async (id: string, data: UpdateProfile) => {
  return await apiWrapper(() =>
    api.patch(`${PROFILE_PARAMS}/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  );
};

// users endpoints
export const searchUserByName = async (search: string) => {
  return await apiWrapper(() =>
    api.get(USERS_PARAMS, {
      params: { search },
    }),
  );
};

export const getUserOnline = async (userIds: string[]) => {
  const data = {
    userIds,
  };
  return await apiWrapper(() => api.post(`${USERS_PARAMS}/online`, data));
};

// chats endpoits

export const addNewChat = async (userId: string) => {
  const data = {
    targetUserId: userId,
  };
  return await apiWrapper(() => api.post(`${CHAT_PARAMS}/create`, data));
};

export const getCurrentChat = async (roomId: string, cursor?: string): Promise<{ messages: Message[]; hasMore: boolean; nextCursor?: string }> => {
  const res = await apiWrapper(() =>
    api.get(`${CHAT_PARAMS}/${roomId}`, {
      params: cursor ? { cursor } : {},
    }),
  );

   return {
    messages: res.data.messages,
    hasMore: res.data.hasMore,
    nextCursor: res.data.nextCursor,
  };
};

export const getChatRoom = async () =>
  await apiWrapper(() => api.get(`${CHAT_PARAMS}`));

export const getAllImagesOfChat = async (
  roomId: string,
): Promise<AxiosResponse<MessageImage[]> | undefined> => {
  return await apiWrapper(() => api.get(`${CHAT_PARAMS}/${roomId}/images`));
};

export const getCompanion = async (roomId: string) => {
  return await apiWrapper(() => api.get(`${CHAT_PARAMS}/${roomId}/companion`));
};

export const removeMessage = async (roomId: string, msgId: string) => {
  return await apiWrapper(() =>
    api.delete(`${CHAT_PARAMS}/${roomId}/message`, {
      params: {
        id: msgId,
      },
    }),
  );
};

export const removeChatRoom = async (roomId: string) => {
  return await apiWrapper(() =>
    api.delete(`${CHAT_PARAMS}/${roomId}/delete-chat`),
  );
};
