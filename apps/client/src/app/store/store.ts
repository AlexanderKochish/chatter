import chatLayoutReducer from "@/features/chat-layout/model/store/chat-layout.api";
import imageViewerReducer from "@/features/image-viewer/model/store/image.store";
import { baseApi } from "@/shared/api/baseApi";
import { configureStore } from "@reduxjs/toolkit";
import chatSliceReducer from "@/features/send-message/model/store/chat.slice";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    chatLayout: chatLayoutReducer,
    imageViewer: imageViewerReducer,
    chat: chatSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
