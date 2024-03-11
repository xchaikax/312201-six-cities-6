import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { StatusCodes } from "http-status-codes";
import {
  BaseController,
  HttpError,
  HttpMethod, PrivateRouteMiddleware,
  ValidateCityMiddleware, ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
} from "../../../shared/libs/rest/index.js";
import { City, Component } from "../../../shared/types/index.js";
import { Logger } from "../../../shared/libs/logger/index.js";
import { fillDTO } from "../../../shared/helpers/index.js";
import { DocumentExistsMiddleware } from "../../../shared/libs/rest/index.js";
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
        new PrivateRouteMiddleware(),
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
      path: "/favorites",
      method: HttpMethod.Get,
      handler: this.findFavorites,
      middlewares: [
        new PrivateRouteMiddleware(),
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
        new PrivateRouteMiddleware(),
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
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware("offerId"),
        new DocumentExistsMiddleware(this.offerService, "Offer", "offerId"),
      ],
    });
    this.addRoute({
      path: "/:offerId/favorite",
      method: HttpMethod.Patch,
      handler: this.addOfferToFavorites,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware("offerId"),
        new DocumentExistsMiddleware(this.offerService, "Offer", "offerId"),
      ],
    });

    this.addRoute({
      path: "/:offerId/favorite",
      method: HttpMethod.Delete,
      handler: this.deleteOfferFromFavorites,
      middlewares: [
        new PrivateRouteMiddleware(),
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
    { query: { amount }, tokenPayload }: FindAllOffersRequestType,
    res: Response,
  ) {
    const limit = amount || OFFERS_AMOUNT_LIMIT;
    const result = await this.offerService.findAll(limit);
    const favoriteOffers = tokenPayload ? await this.userService.getFavorites(tokenPayload.id) : [];

    this.ok(res, result.map((offer) => fillDTO(OfferRdo, { ...offer, isFavorite: favoriteOffers.includes(offer.id) })));
  }

  public async findPremiumOffersByCity(
    { params: { city }, tokenPayload }: FindPremiumByCityRequest,
    res: Response,
  ) {
    const result = await this.offerService.findPremiumOffersByCity(city as City);
    const favoriteOffers = tokenPayload ? await this.userService.getFavorites(tokenPayload.id) : [];

    this.ok(res, result.map((offer) => fillDTO(OfferRdo, { ...offer, isFavorite: favoriteOffers.includes(offer.id) })));
  }

  public async findById(
    { params: { offerId }, tokenPayload }: FindOfferRequest,
    res: Response,
  ) {
    const offer = await this.offerService.findById(offerId);

    const favoriteOffers = tokenPayload ? await this.userService.getFavorites(tokenPayload.id) : [];

    this.ok(res, fillDTO(DetailedOfferRdo, { ...offer, isFavorite: favoriteOffers.includes(offer!.id) }));
  }

  public async findFavorites({ tokenPayload: { id } }: Request, res: Response) {
    const result = await this.offerService.findFavoriteOffersByUserId(id);
    return this.ok(res, result.map((offer) => fillDTO(OfferRdo, offer)));
  }

  public async updateById(
    { params: { offerId }, body, tokenPayload }: UpdateOfferRequest,
    res: Response,
  ) {
    const offer = await this.offerService.updateById(offerId, body);

    const favoriteOffers = tokenPayload ? await this.userService.getFavorites(tokenPayload.id) : [];

    this.ok(res, fillDTO(DetailedOfferRdo, { ...offer, isFavorite: favoriteOffers.includes(offer!.id) }));
  }

  public async deleteById(
    { params: { offerId } }: DeleteOfferRequest,
    res: Response,
  ) {
    const deletedId = await this.offerService.deleteById(offerId);

    this.ok(res, deletedId);
  }

  public async addOfferToFavorites(
    { params: { offerId }, tokenPayload: { id } }: Request,
    res: Response,
  ) {
    await this.userService.addOfferToFavorites(id, offerId);

    this.ok(res, { success: true });
  }

  public async deleteOfferFromFavorites(
    { params: { offerId }, tokenPayload: { id } }: Request,
    res: Response,
  ) {
    await this.userService.deleteOfferFromFavorites(id, offerId);

    this.ok(res, { success: true });
  }
}
