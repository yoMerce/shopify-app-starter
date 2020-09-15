import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import Cookies from "js-cookie";
import { AppProvider } from "@shopify/polaris";
import { Provider } from "@shopify/app-bridge";
import translations from "@shopify/polaris/locales/en.json";

import Config from "../config";

const client = new ApolloClient({
  fetchOptions: {
    credentials: "include",
  },
});

function App({ Component, pageProps }) {
  const shopOrigin = Cookies.get(process.env.NEXT_PUBLIC_COOKIE_KEY);
  return (
    <>
      <AppProvider i18n={translations}>
         {process.env.NEXT_PUBLIC_ENV !== "local" ? (
          <Provider
            config={{
              apiKey: process.env.NEXT_PUBLIC_API_KEY,
              shopOrigin,
              forceRedirect: true,
            }}
          >
            <ApolloProvider client={client}>
              <Component {...pageProps} />
            </ApolloProvider>
          </Provider>
        ): ( 
          <ApolloProvider client={client}>
            <Component {...pageProps} />
          </ApolloProvider>
        )}
      </AppProvider>
    </>
  );
}

export default App;
