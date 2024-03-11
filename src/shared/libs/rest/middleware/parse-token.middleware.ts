import { NextFunction, Request, Response } from "express";
import { jwtVerify } from "jose";
import { StatusCodes } from "http-status-codes";
import { createSecretKey } from "node:crypto";
import { HttpError } from "../errors/http-error.js";
import { Middleware } from "./middleware.interface.js";
import { TokenPayload } from "../../../../rest/modules/auth/index.js";

export class ParseTokenMiddleware implements Middleware {
  constructor(private readonly jwtSecret: string) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const authorizationHeader = req.headers?.authorization?.split(" ");

    if (!authorizationHeader) {
      return next();
    }

    const [, token] = authorizationHeader;

    try {
      const { payload } = await jwtVerify(token, createSecretKey(this.jwtSecret, "utf-8"));

      if (isTokenPayload(payload)) {
        req.tokenPayload = { ...payload };
        return next();
      } else {
        throw new Error("Invalid token");
      }
    } catch {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        "Invalid token",
        "ParseTokenMiddleware",
      );
    }
  }
}

function isTokenPayload(payload: unknown): payload is TokenPayload {
  return (
    (typeof payload === "object" && payload !== null) &&
    ("email" in payload && typeof payload.email === "string") &&
    ("name" in payload && typeof payload.name === "string") &&
    ("id" in payload && typeof payload.id === "string")
  );
}
