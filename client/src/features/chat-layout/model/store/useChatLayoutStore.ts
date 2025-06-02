import { create } from "zustand";

type ChatLayoutState = {
  isActive: boolean;
  isSearch: boolean;
  isRemoveChat: boolean;
  isLogout: boolean;
  isProfile: boolean;
  setIsActive: (value: boolean) => void;
  toggleIsActive: () => void;
  setIsSearch: (value: boolean) => void;
  toggleIsSearch: () => void;
  setIsRemoveChat: (value: boolean) => void;
  toggleIsRemoveChat: () => void;
  setIsLogout: (value: boolean) => void;
  setIsProfile: (value: boolean) => void;
};

export const useChatLayoutStore = create<ChatLayoutState>((set) => ({
  isActive: false,
  isSearch: false,
  isRemoveChat: false,
  isLogout: false,
  isProfile: false,
  setIsActive: (value) => set({ isActive: value }),
  toggleIsActive: () => set((state) => ({ isActive: !state.isActive })),
  setIsSearch: (value) => set({ isSearch: value }),
  toggleIsSearch: () => set((state) => ({ isSearch: !state.isSearch })),
  setIsRemoveChat: (value) => set({ isRemoveChat: value }),
  toggleIsRemoveChat: () =>
    set((state) => ({ isRemoveChat: !state.isRemoveChat })),
  setIsLogout: (value) => set({ isLogout: value }),
  setIsProfile: (value) => set({ isProfile: value }),
}));
