import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { RequestBody, ResponseBody } from "../../../../shared/libs/rest/index.js";
import { City } from "../../../../shared/types/index.js";

export type FindPremiumByCityRequest = Request<{ city: City } | ParamsDictionary, ResponseBody, RequestBody>;
