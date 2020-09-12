import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { AppProvider } from "@shopify/polaris";
import translations from "@shopify/polaris/locales/en.json";

const client = new ApolloClient();

function App({ Component, pageProps }) {
  return (
    <>
      <AppProvider i18n={translations}>
        <ApolloProvider client={client}>
          <Component {...pageProps} />
        </ApolloProvider>
      </AppProvider>
    </>
  );
}

export default App;
