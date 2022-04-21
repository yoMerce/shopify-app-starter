import { StrictMode } from "react";
import { AppProvider as PolarisProvider } from "@shopify/polaris";
import translations from "@shopify/polaris/locales/en.json";
import { createRoot } from "react-dom/client";

import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PolarisProvider i18n={translations}>
      <App />
    </PolarisProvider>
  </StrictMode>
);
