import { Message } from '@/shared/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChatState {
  pages: Message[][];
  nextCursor?: string;
}

const initialState: ChatState = {
  pages: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    resetChat(state) {
      state.pages = [];
      state.nextCursor = undefined;
    },
    appendPage(state, action: PayloadAction<{ messages: Message[]; nextCursor?: string }>) {
      state.pages.push(action.payload.messages);
      state.nextCursor = action.payload.nextCursor;
    },
    addNewMessage(state, action: PayloadAction<Message>) {
      const exists = state.pages[0]?.some((m) => m.id === action.payload.id);
      if (!exists) {
        state.pages[0] = [action.payload, ...(state.pages[0] || [])];
      }
    },
    updateMessage(state, action: PayloadAction<Message>) {
      state.pages = state.pages.map((page) =>
        page.map((m) => (m.id === action.payload.id ? action.payload : m))
      );
    },
    removeMessage(state, action: PayloadAction<string>) {
      state.pages = state.pages.map((page) => page.filter((m) => m.id !== action.payload));
    },
  },
});

export const { resetChat, appendPage, addNewMessage, updateMessage, removeMessage } = chatSlice.actions;
export default chatSlice.reducer;

