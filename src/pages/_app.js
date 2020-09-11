const { ApolloClient } = require("apollo-boost");
const { ApolloProvider } = require("react-apollo");
const { AppProvider } = require("@shopify/polaris");
const translations = require("@shopify/polaris/locales/en.json");

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

module.exports = App;
