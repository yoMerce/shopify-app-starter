import { Provider as AppBridgeProvider } from "@shopify/app-bridge-react";
import "@shopify/polaris/build/esm/styles.css";

import BaseProvider from "./BaseProvider";

function App() {
  return (
    // <AppBridgeProvider
    //   config={{
    //     apiKey: process.env.SHOPIFY_API_KEY || "",
    //     host: new URL(location.toString()).searchParams.get("host") || "",
    //     forceRedirect: true,
    //   }}
    // >
    <BaseProvider />
    // </AppBridgeProvider>
  );
}

export default App;
