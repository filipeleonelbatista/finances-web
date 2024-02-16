import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./global.css";

import { ThemeProvider } from "@/components/theme-provider";
import { PaymentsContextProvider } from "./context/PaymentsContext";
import { Toaster } from "@/components/ui/toaster"
import { StockContextProvider } from "./context/StockContext.tsx";
import { SettingsContextProvider } from "./context/SettingsContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <SettingsContextProvider>
        <PaymentsContextProvider>
          <StockContextProvider>
            <App />
            <Toaster />
          </StockContextProvider>
        </PaymentsContextProvider>
      </SettingsContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);
