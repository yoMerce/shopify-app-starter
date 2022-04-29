import { IRequest } from "@interfaces";
import Shopify from "@shopify/shopify-api";
import { Application, NextFunction, Response } from "express";
import { verifyRequest } from "../middlewares";

function setupGraphQLProxy(app: Application) {
  // Graphql proxy for Shopify
  app.post(
    "/graphql",
    verifyRequest(app),
    async (req: IRequest, res: Response, next: NextFunction) => {
      try {
        const response = await Shopify.Utils.graphqlProxy(req, res);
        res.status(200).send(response.body);
      } catch (err) {
        res.status(500).send(err.message);
      }
      next();
    }
  );
}

export default setupGraphQLProxy;
