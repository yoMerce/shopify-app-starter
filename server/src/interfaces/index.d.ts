import { Logger } from "@s25digital/express-mw-logger";
import { Request } from "express";

export interface IRequest extends Request {
  logger: Logger;
}
