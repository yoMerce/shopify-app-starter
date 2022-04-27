import { Logger } from "@s25digital/express-mw-logger";
import { Request } from "express";
import { Db } from "mongodb";
import { IShop } from "./shop";

export interface IRequest extends Request {
  logger: Logger;
  db: Db;
  shopInfo: IShop;
}

export * from "./shop";
