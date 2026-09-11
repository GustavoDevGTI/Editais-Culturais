import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AccessibilityProvider } from "./accessibility/AccessibilityContext";
import { App } from "./App";
import { VLibras } from "./components/VLibras";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AccessibilityProvider>
      <App />
      <VLibras />
    </AccessibilityProvider>
  </StrictMode>,
);
