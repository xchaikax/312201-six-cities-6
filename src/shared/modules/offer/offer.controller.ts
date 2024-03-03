import { Response } from "express";
import { inject, injectable } from "inversify";
import { StatusCodes } from "http-status-codes";
import {
  BaseController,
  HttpError,
  HttpMethod,
  ValidateCityMiddleware, ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
} from "../../libs/rest/index.js";
import { City, Component } from "../../types/index.js";
import { Logger } from "../../libs/logger/index.js";
import { fillDTO } from "../../helpers/index.js";
import { DocumentExistsMiddleware } from "../../libs/rest/index.js";
import { UserService } from "../user/index.js";
import { OfferService } from "./offer-service.interface.js";
import { OFFERS_AMOUNT_LIMIT } from "./offer.constants.js";
import { OfferRdo } from "./rdo/offer.rdo.js";
import { DetailedOfferRdo } from "./rdo/detailed-offer.rdo.js";
import { CreateOfferRequest } from "./types/create-offer-request.type.js";
import { FindOfferRequest } from "./types/find-offer-request.type.js";
import { FindAllOffersRequestType } from "./types/find-all-offers-request.type.js";
import { FindPremiumByCityRequest } from "./types/find-premium-by-city-request.type.js";
import { UpdateOfferRequest } from "./types/update-offer-request.type.js";
import { DeleteOfferRequest } from "./types/delete-offer-request.type.js";
import { CreateOfferDto } from "./dto/create-offer.dto.js";
import { UpdateOfferDto } from "./dto/update-offer.dto.js";

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.UserService) private readonly userService: UserService,
  ) {
    super(logger);
    this.logger.info("Register routes for OfferController…");

    this.addRoute({ path: "/", method: HttpMethod.Get, handler: this.findAll });
    this.addRoute({
      path: "/",
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateDtoMiddleware(CreateOfferDto),
      ],
    });
    this.addRoute({
      path: "/premium/:city",
      method: HttpMethod.Get,
      handler: this.findPremiumOffersByCity,
      middlewares: [
        new ValidateCityMiddleware(),
      ],
    });
    this.addRoute({
      path: "/:offerId",
      method: HttpMethod.Get,
      handler: this.findById,
      middlewares: [
        new ValidateObjectIdMiddleware("offerId"),
        new DocumentExistsMiddleware(this.offerService, "Offer", "offerId"),
      ],
    });
    this.addRoute({
      path: "/:offerId",
      method:
      HttpMethod.Patch,
      handler: this.updateById,
      middlewares: [
        new ValidateObjectIdMiddleware("offerId"),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, "Offer", "offerId"),
      ],
    });
    this.addRoute({
      path: "/:offerId",
      method: HttpMethod.Delete,
      handler: this.deleteById,
      middlewares: [
        new ValidateObjectIdMiddleware("offerId"),
        new DocumentExistsMiddleware(this.offerService, "Offer", "offerId"),
      ],
    });
  }

  public async create(
    { body }: CreateOfferRequest,
    res: Response,
  ) {
    if (!(await this.userService.exists(body.authorId))) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with id ${body.authorId} does not exist`,
        "OfferController",
      );
    }

    const result = await this.offerService.create(body);

    this.created(res, fillDTO(OfferRdo, result));
  }

  public async findAll(
    { query: { amount } }: FindAllOffersRequestType,
    res: Response,
  ) {
    const limit = amount || OFFERS_AMOUNT_LIMIT;
    const result = await this.offerService.findAll(limit);

    this.ok(res, result.map((offer) => fillDTO(OfferRdo, offer)));
  }

  public async findPremiumOffersByCity(
    { params: { city } }: FindPremiumByCityRequest,
    res: Response,
  ) {
    const result = await this.offerService.findPremiumOffersByCity(city as City);

    this.ok(res, result.map((offer) => fillDTO(OfferRdo, offer)));
  }

  public async findById(
    { params: { offerId } }: FindOfferRequest,
    res: Response,
  ) {
    const offer = await this.offerService.findById(offerId);

    this.ok(res, fillDTO(DetailedOfferRdo, offer));
  }

  public async updateById(
    { params: { offerId }, body }: UpdateOfferRequest,
    res: Response,
  ) {
    const offer = await this.offerService.updateById(offerId, body);

    this.ok(res, fillDTO(DetailedOfferRdo, offer));
  }

  public async deleteById(
    { params: { offerId } }: DeleteOfferRequest,
    res: Response,
  ) {
    const deletedId = await this.offerService.deleteById(offerId);

    this.ok(res, deletedId);
  }
}
