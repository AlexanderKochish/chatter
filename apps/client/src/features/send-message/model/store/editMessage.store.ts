import { create } from "zustand";

interface EditMessageState {
  openMessageId: string | null;
  editMessageId: string | null;
  editText: string;
  setOpenMessageId: (id: string | null) => void;
  setEditMessageId: (id: string | null) => void;
  setEditText: (text: string) => void;
  clearEditState: () => void;
}

export const useEditMessage = create<EditMessageState>((set) => ({
  openMessageId: null,
  editMessageId: null,
  editText: "",
  setOpenMessageId: (id) => set({ openMessageId: id }),
  setEditMessageId: (id) => set({ editMessageId: id }),
  setEditText: (text) => set({ editText: text }),
  clearEditState: () => set({ editText: "", editMessageId: null }),
}));
