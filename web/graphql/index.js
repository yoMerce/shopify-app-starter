// @ts-check
import {Shopify} from "@shopify/shopify-api";

function setupGraphQL(app) {
  app.post("/api/graphql", async (req, res) => {
    try {
      const response = await Shopify.Utils.graphqlProxy(req, res);
      res.status(200).send(response.body);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
}

export async function queryShopify(shop, accessToken, query) {
  const client = new Shopify.Clients.Graphql(
    shop,
    accessToken
  );
  return await client.query({ data: query });
}

export default setupGraphQL;
