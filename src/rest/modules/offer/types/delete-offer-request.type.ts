import { Request } from "express";
import { ParamOfferId } from "../../offer/index.js";

export type DeleteOfferRequest = Request<ParamOfferId>
