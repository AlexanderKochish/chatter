import { StrictMode } from "react";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "react-image-crop/dist/ReactCrop.css";
import "./shared/styles/index.css";
import App from "./app/App";
import { store } from "./app/store/store";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <Toaster position="bottom-left" />
    </Provider>
  </StrictMode>,
);
