import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from "@apollo/client";
import { useAppBridge } from "@shopify/app-bridge-react";
import { ClientApplication } from "@shopify/app-bridge";
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import { Redirect } from "@shopify/app-bridge/actions";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";

function customFetch(app: ClientApplication) {
  const fetch = authenticatedFetch(app);

  return async (uri: RequestInfo, options?: RequestInit | undefined) => {
    const response = await fetch(uri, options);

    if (response.headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1") {
      const authUrlHeader = response.headers.get("X-Shopify-API-Request-Failure-Reauthorize-Url");

      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.APP, authUrlHeader || "/auth");
      return response;
    }

    return response;
  };
}

function Provider() {
  const app = useAppBridge();

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      credentials: "include",
      fetch: customFetch(app),
    }),
  });

  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default Provider;