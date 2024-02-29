import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { HttpError } from "../errors/http-error.js";
import { Middleware } from "./middleware.interface.js";
import { capitalize, isCity } from "../../../helpers/index.js";

export class ValidateCityMiddleware implements Middleware {
  constructor() {}

  public execute({ params }: Request, _res: Response, next: NextFunction): void {
    const city = capitalize(params.city);

    if (!isCity(city)){
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        "Correct city is required",
        "ValidateCityMiddleware",
      );
    }

    params.city = city;
    next();
  }
}
