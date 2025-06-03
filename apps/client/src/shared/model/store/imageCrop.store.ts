import { create } from "zustand";
import { Crop, PixelCrop } from "react-image-crop";

interface ImageCropState {
  crop: Crop | undefined;
  imgSrc: string;
  completedCrop?: PixelCrop;
  rawFile: File | null;
  isOpen: boolean;

  setCrop: (c: Crop) => void;
  setImgSrc: (imgSrc: string) => void;
  setCompletedCrop: (crop: PixelCrop) => void;
  setRawFile: (file: File | null) => void;
  setIsOpen: (open: boolean) => void;
}

export const useImageCropStore = create<ImageCropState>((set) => ({
  crop: undefined,
  imgSrc: "",
  isOpen: false,
  completedCrop: undefined,
  rawFile: null,
  setCrop: (crop) => set({ crop }),
  setImgSrc: (imgSrc) => set({ imgSrc }),
  setIsOpen: (isOpen) => set({ isOpen }),
  setCompletedCrop: (completedCrop) => set({ completedCrop }),
  setRawFile: (rawFile) => set({ rawFile }),
}));
