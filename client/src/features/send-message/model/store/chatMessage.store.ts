import { create } from "zustand";
import { getCurrentChat } from "@shared/api";
import { Message } from "@shared/types";

interface ChatMessagesState {
  messages: Message[];
  loading: boolean;
  hasMore: boolean;
  cursor: string | null;

  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (message: Message) => void;
  removeMessage: (message: Message) => void;
  setCursor: (cursor: string | null) => void;
  setHasMore: (hasMore: boolean) => void;
  setLoading: (loading: boolean) => void;

  fetchMoreMessages: (roomId: string) => Promise<void>;
}

export const useChatMessagesStore = create<ChatMessagesState>((set, get) => ({
  messages: [],
  loading: false,
  hasMore: true,
  cursor: null,

  setMessages: (messages) => set({ messages }),

  addMessage: (message) =>
    set((state) => ({ messages: [message, ...state.messages] })),

  updateMessage: (message) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === message.id ? message : msg,
      ),
    })),

  removeMessage: (message) =>
    set((state) => ({
      messages: state.messages.filter((msg) => msg.id !== message.id),
    })),

  setCursor: (cursor) => set({ cursor }),
  setHasMore: (hasMore) => set({ hasMore }),
  setLoading: (loading) => set({ loading }),

  fetchMoreMessages: async (roomId) => {
    const { loading, hasMore, cursor, messages } = get();
    if (loading || !hasMore || !roomId) return;

    set({ loading: true });
    try {
      const res = await getCurrentChat(roomId, cursor ?? undefined);
      const newMessages = res?.messages ?? [];
      const existingIds = new Set(messages.map((msg) => msg.id));
      const uniqueNewMessages = newMessages.filter(
        (msg: { id: string }) => !existingIds.has(msg.id),
      );

      set({
        messages: [...messages, ...uniqueNewMessages],
        cursor: newMessages[newMessages.length - 1]?.id ?? null,
        hasMore: Boolean(res?.hasMore),
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      set({ loading: false });
    }
  },
}));
