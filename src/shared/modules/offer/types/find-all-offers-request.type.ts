import { Request } from "express";
import { RequestBody, RequestParams, ResponseBody } from "../../../libs/rest/index.js";

export type FindAllOffersRequestType = Request<RequestParams, ResponseBody, RequestBody, { amount?: number }>
