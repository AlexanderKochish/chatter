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
import { MessageImage, UpdateProfile } from "@shared/types";

const api = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const handlerError = async (error: unknown) => {
  if (error instanceof AxiosError) {
    throw new Error(error.response?.data ?? error.message);
  }
  throw new Error("An expected error occurred");
};

const refreshTokens = async () => {
  try {
    await api.post("/auth/refresh");
  } catch (error) {
    await handlerError(error);
  }
};

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
  try {
    return await api.post(SIGN_UP_PARAMS, data);
  } catch (error) {
    await handlerError(error);
  }
};

export const signIn = async (data: SignInSchemaType) => {
  try {
    return await api.post(SIGN_IN_PARAMS, data);
  } catch (error) {
    await handlerError(error);
  }
};

export const logout = async () => {
  try {
    return await api.post(`${LOGOUT}`);
  } catch (error) {
    await handlerError(error);
  }
};

// profile endpoints
export const getMe = async () => {
  try {
    await refreshTokens();
    return await api.get(`${PROFILE_PARAMS}/me`);
  } catch (error) {
    await handlerError(error);
  }
};

export const updateProfile = async (id: string, data: UpdateProfile) => {
  try {
    return await api.patch(`${PROFILE_PARAMS}/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    await handlerError(error);
  }
};

// users endpoints
export const searchUserByName = async (search: string) => {
  try {
    return await api.get(USERS_PARAMS, {
      params: { search },
    });
  } catch (error) {
    await handlerError(error);
  }
};

export const getUserOnline = async (userIds: string[]) => {
  const data = {
    userIds,
  };
  try {
    return await api.post(`${USERS_PARAMS}/online`, data);
  } catch (error) {
    await handlerError(error);
  }
};

// chats endpoits

export const addNewChat = async (userId: string) => {
  const data = {
    targetUserId: userId,
  };
  try {
    return await api.post(`${CHAT_PARAMS}/create`, data);
  } catch (error) {
    await handlerError(error);
  }
};

export const getCurrentChat = async (roomId: string, cursor?: string) => {
  try {
    const res = await api.get(`${CHAT_PARAMS}/${roomId}`, {
      params: cursor ? { cursor } : {},
    });

    const hasMore = res.data.messages.length === 20;
    const messages = res.data.messages ?? [];

    return { messages, hasMore };
  } catch (error) {
    await handlerError(error);
  }
};

export const getChatRoom = async () => {
  try {
    return await api.get(`${CHAT_PARAMS}`);
  } catch (error) {
    await handlerError(error);
  }
};

export const getAllImagesOfChat = async (
  roomId: string,
): Promise<AxiosResponse<MessageImage[]> | undefined> => {
  try {
    return await api.get(`${CHAT_PARAMS}/${roomId}/images`);
  } catch (error) {
    await handlerError(error);
  }
};

export const getCompanion = async (roomId: string) => {
  try {
    return await api.get(`${CHAT_PARAMS}/${roomId}/companion`);
  } catch (error) {
    await handlerError(error);
  }
};

export const removeMessage = async (roomId: string, msgId: string) => {
  try {
    return await api.delete(`${CHAT_PARAMS}/${roomId}/message`, {
      params: {
        id: msgId,
      },
    });
  } catch (error) {
    await handlerError(error);
  }
};
