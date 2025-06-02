import { StrictMode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "react-image-crop/dist/ReactCrop.css";
import "./shared/styles/index.css";
import App from "./app/App";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster position="bottom-left" />
    </QueryClientProvider>
  </StrictMode>,
);
