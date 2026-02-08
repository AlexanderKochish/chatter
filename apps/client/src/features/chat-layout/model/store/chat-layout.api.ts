import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ChatLayoutState = {
  isActive: boolean;
  isSearch: boolean;
  isRemoveChat: boolean;
  isLogout: boolean;
  isProfile: boolean;
};

const initialState: ChatLayoutState = {
  isActive: false,
  isSearch: false,
  isRemoveChat: false,
  isLogout: false,
  isProfile: false,
};

export const chatLayoutSlice = createSlice({
  name: "chatLayout",
  initialState,
  reducers: {
    setIsActive: (state, action: PayloadAction<boolean>) => {
      state.isActive = action.payload;
    },
    toggleIsActive: (state) => {
      state.isActive = !state.isActive;
    },
    setIsSearch: (state, action: PayloadAction<boolean>) => {
      state.isSearch = action.payload;
    },
    toggleIsSearch: (state) => {
      state.isSearch = !state.isSearch;
    },
    setIsRemoveChat: (state, action: PayloadAction<boolean>) => {
      state.isRemoveChat = action.payload;
    },
    toggleIsRemoveChat: (state) => {
      state.isRemoveChat = !state.isRemoveChat;
    },
    setIsLogout: (state, action: PayloadAction<boolean>) => {
      state.isLogout = action.payload;
    },
    setIsProfile: (state, action: PayloadAction<boolean>) => {
      state.isProfile = action.payload;
    },
  },
});

export const {
  setIsActive,
  toggleIsActive,
  setIsSearch,
  toggleIsSearch,
  setIsRemoveChat,
  toggleIsRemoveChat,
  setIsLogout,
  setIsProfile,
} = chatLayoutSlice.actions;

export default chatLayoutSlice.reducer;
