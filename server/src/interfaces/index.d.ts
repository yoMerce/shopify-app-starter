import { Logger } from "@s25digital/express-mw-logger";
import { Request } from "express";
import { Db } from "mongodb";

export interface IRequest extends Request {
  logger: Logger;
  db: Db;
}
