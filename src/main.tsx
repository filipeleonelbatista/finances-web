import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./global.css";

import { ThemeProvider } from "@/components/theme-provider";
import { PaymentsContextProvider } from "./context/PaymentsContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <PaymentsContextProvider>
        <App />
      </PaymentsContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);
