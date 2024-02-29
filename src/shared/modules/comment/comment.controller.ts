import { Response } from "express";
import { inject, injectable } from "inversify";
import { StatusCodes } from "http-status-codes";
import {
  BaseController,
  HttpError,
  HttpMethod,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
} from "../../libs/rest/index.js";
import { Component } from "../../types/index.js";
import { Logger } from "../../libs/logger/index.js";
import { fillDTO } from "../../helpers/index.js";
import { DocumentExistsMiddleware } from "../../libs/rest/index.js";
import { OfferService } from "../offer/index.js";
import { CommentService } from "./comment-service.interface.js";
import { CommentRdo } from "./rdo/comment.rdo.js";
import { CreateCommentRequest } from "./types/create-comment-request.type.js";
import { FindCommentsRequest } from "./types/find-comments-request.js";
import { CreateCommentDto } from "./dto/create-comment.dto.js";

@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);
    this.logger.info("Register routes for CommentsController…");

    this.addRoute({
      path: "/:offerId",
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateObjectIdMiddleware("offerId"),
        new DocumentExistsMiddleware(this.offerService, "Offer", "offerId"),
        new ValidateDtoMiddleware(CreateCommentDto),
      ],
    });
    this.addRoute({
      path: "/:offerId",
      method: HttpMethod.Get,
      handler: this.findByOfferId,
      middlewares: [
        new ValidateObjectIdMiddleware("offerId"),
        new DocumentExistsMiddleware(this.offerService, "Offer", "offerId"),
      ],
    });
  }

  public async create(
    { body, params: { offerId } }: CreateCommentRequest,
    res: Response,
  ) {
    const result = await this.commentService.create({
      ...body,
      offerId,
    });

    const newRating = await this.commentService.getUpdatedAverageRating(offerId);
    const updatedOffer = await this.offerService.updateByIdOnNewComment(offerId, newRating);

    if (!updatedOffer) {
      throw new HttpError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Offer with id ${offerId} was not updated.`,
        "CommentController",
      );
    }

    this.created(res, fillDTO(CommentRdo, result));
  }

  public async findByOfferId(
    { params: { offerId } }: FindCommentsRequest,
    res: Response,
  ) {
    const comments = await this.commentService.findByOfferId(offerId);

    this.ok(res, fillDTO(CommentRdo, comments));
  }
}
