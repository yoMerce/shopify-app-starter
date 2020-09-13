import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import Cookies from "js-cookie";
import { AppProvider } from "@shopify/polaris";
import { Provider } from "@shopify/app-bridge";
import translations from "@shopify/polaris/locales/en.json";

const client = new ApolloClient({
  fetchOptions: {
    credentials: "include",
  },
});

function App({ Component, pageProps }) {
  const shopOrigin = Cookies.get("shopOrigin");

  return (
    <>
      <AppProvider i18n={translations}>
        <Provider config = {{
          apiKey: API_KEY,
          shopOrigin,
          forceRedirect: true
        }}>
          <ApolloProvider client={client}>
            <Component {...pageProps} />
          </ApolloProvider>
        </Provider>
      </AppProvider>
    </>
  );
}

export default App;
