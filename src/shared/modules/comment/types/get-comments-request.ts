import { Request } from "express";
import { ParamOfferId } from "../../offer/index.js";

export type GetCommentsRequest = Request<ParamOfferId>
