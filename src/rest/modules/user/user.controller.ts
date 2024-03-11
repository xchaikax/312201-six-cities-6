import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  BaseController,
  HttpError,
  HttpMethod,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
} from "../../../shared/libs/rest/index.js";
import { Logger } from "../../../shared/libs/logger/index.js";
import { UploadFileMiddleware } from "../../../shared/libs/rest/index.js";
import { Config, RestSchema } from "../../../shared/libs/config/index.js";
import { Component } from "../../../shared/types/index.js";
import { fillDTO } from "../../../shared/helpers/index.js";
import { AuthService } from "../auth/index.js";
import { CreateUserRequest } from "./types/create-user-request.type.js";
import { UserService } from "./user-service.interface.js";
import { UserRdo } from "./rdo/user.rdo.js";
import { LoginUserRequest } from "./types/login-user-request.type.js";
import { CreateUserDto } from "./dto/create-user.dto.js";
import { LoginUserDto } from "./dto/login-user.dto.js";
import { LoggedInUserRdo } from "./dto/logged-in-user.rdo.js";

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.AuthService) private readonly authService: AuthService,
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
    this.addRoute({
      path: "/:userId/avatar",
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware("userId"),
        new UploadFileMiddleware(this.configService.get("UPLOAD_DIRECTORY"), "avatar"),
      ],
    });
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
    res: Response,
  ) {
    const existingUser = await this.userService.findByEmail(body.email);

    if (!existingUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email ${body.email} not found.`,
        "UserController",
      );
    }

    const user = await this.authService.verify(body);
    const token = await this.authService.authenticate(user);

    this.ok(res, fillDTO(LoggedInUserRdo, { email: user.email, token }));
  }

  public async logout({ tokenPayload }: Request, res: Response) {
    const foundUser = await this.userService.findByEmail(tokenPayload.email);

    if (!foundUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        "Unauthorized",
        "UserController",
      );
    }

    this.noContent(res, foundUser);
  }

  public async status({ tokenPayload }: Request, res: Response) {
    const foundUser = await this.userService.findByEmail(tokenPayload.email);

    if (!foundUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        "Unauthorized",
        "UserController",
      );
    }

    this.ok(res, fillDTO(LoggedInUserRdo, foundUser));
  }

  public async uploadAvatar(req: Request, res: Response) {
    const { id, email } = req.tokenPayload;

    if(!req.file?.path) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `File error while uploading avatar for user ${email}`,
        "UserController",
      );
    }

    await this.userService.updateById(id, { avatar: req.file.filename });

    this.created(res, {
      filepath: req.file?.path,
    });
  }
}
