import { create } from "zustand";

interface ZoomState {
  zoom: number;
  setZoom: (value: number) => void;
  resetZoom: () => void;
}

export const useZoomStore = create<ZoomState>((set) => ({
  zoom: 1,
  setZoom: (value) => set({ zoom: value }),
  resetZoom: () => set({ zoom: 1 }),
}));
