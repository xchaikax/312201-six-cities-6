import { Request } from "express";
import { ResponseBody } from "../../../../shared/libs/rest/index.js";
import { ParamOfferId, UpdateOfferDto } from "../../offer/index.js";

export type UpdateOfferRequest = Request<ParamOfferId, ResponseBody, UpdateOfferDto>
