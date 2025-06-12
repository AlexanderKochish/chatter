import { createSlice } from "@reduxjs/toolkit"
import { Crop, PixelCrop } from "react-image-crop";

type ZoomState = {
  zoom: number;
  crop: Crop | undefined;
  imgSrc: string;
  completedCrop?: PixelCrop;
  rawFile: File | null;
  isOpen: boolean;
}

const initialState: ZoomState = {
  zoom: 1,
  crop: undefined,
  imgSrc: "",
  isOpen: false,
  completedCrop: undefined,
  rawFile: null,
}

export const imageViewerSlice = createSlice({
  name: 'imageViewer',
  initialState,
  reducers: {
    setZoom: (state, action) => {
      state.zoom = action.payload
    },
    resetZoom: (state) => {
      state.zoom = 1
    },
    setCrop: (state, action) => {
      state.crop = action.payload
    },
    setImgSrc: (state, action) => {
      state.imgSrc = action.payload
    },
    setIsOpen: (state, action) => {
      state.isOpen = action.payload
    },
    setCompletedCrop: (state, action) => {
      state.completedCrop = action.payload
    },
    setRawFile: (state, action) => {
      state.rawFile = action.payload
    },
  }
})

export const { 
  setZoom, 
  resetZoom, 
  setCompletedCrop, 
  setCrop, 
  setImgSrc, 
  setIsOpen, 
  setRawFile 
} = imageViewerSlice.actions;
export default imageViewerSlice.reducer;
