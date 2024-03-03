import { inject, injectable } from "inversify";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BaseController, HttpError, HttpMethod, ValidateDtoMiddleware } from "../../libs/rest/index.js";
import { Logger } from "../../libs/logger/index.js";
import { Component } from "../../types/index.js";
import { CreateUserRequest } from "./types/create-user-request.type.js";
import { UserService } from "./user-service.interface.js";
import { Config, RestSchema } from "../../libs/config/index.js";
import { fillDTO } from "../../helpers/index.js";
import { UserRdo } from "./rdo/user.rdo.js";
import { LoginUserRequest } from "./types/login-user-request.type.js";
import { CreateUserDto } from "./dto/create-user.dto.js";
import { LoginUserDto } from "./dto/login-user.dto.js";

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
  ) {
    super(logger);
    this.logger.info("Register routes for UserController…");

    this.addRoute({
      path: "/register",
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateDtoMiddleware(CreateUserDto),
      ],
    });
    this.addRoute({
      path: "/login",
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [
        new ValidateDtoMiddleware(LoginUserDto),
      ],
    });
    this.addRoute({ path: "/logout", method: HttpMethod.Post, handler: this.logout });
    this.addRoute({ path: "/status", method: HttpMethod.Get, handler: this.status });
  }

  public async create(
    { body }: CreateUserRequest,
    res: Response,
  ) {
    const existingUser = await this.userService.findByEmail(body.email);

    if (existingUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`,
        "UserController",
      );
    }

    const result = await this.userService.create(body, this.configService.get("SALT"));
    this.created(res, fillDTO(UserRdo, result));
  }

  public async login(
    { body }: LoginUserRequest,
  ) {
    const existingUser = await this.userService.findByEmail(body.email);

    if (!existingUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email ${body.email} not found.`,
        "UserController",
      );
    }

    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      "Not implemented",
      "UserController",
    );
  }

  public async logout() {
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      "Not implemented",
      "UserController",
    );
  }

  public async status() {
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      "Not implemented",
      "UserController",
    );
  }
}
