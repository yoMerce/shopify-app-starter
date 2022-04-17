import React from "react";
import ReactDOM from "react-dom/client";
import { AppProvider as PolarisProvider } from "@shopify/polaris";
import translations from "@shopify/polaris/locales/en.json";

import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PolarisProvider i18n={translations}>
      <App />
    </PolarisProvider>
  </React.StrictMode>
);
