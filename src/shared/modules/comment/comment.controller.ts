import { Response } from "express";
import { inject, injectable } from "inversify";
import { StatusCodes } from "http-status-codes";
import { BaseController, HttpError, HttpMethod } from "../../libs/rest/index.js";
import { Component } from "../../types/index.js";
import { Logger } from "../../libs/logger/index.js";
import { fillDTO } from "../../helpers/index.js";
import { OfferService } from "../offer/index.js";
import { CommentService } from "./comment-service.interface.js";
import { CommentRdo } from "./rdo/comment.rdo.js";
import { CreateCommentRequest } from "./types/create-comment-request.type.js";
import { FindCommentsRequest } from "./types/find-comments-request.js";

@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);
    this.logger.info("Register routes for CommentsController…");

    this.addRoute({ path: "/", method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: "/:offerId", method: HttpMethod.Get, handler: this.findByOfferId });
  }

  public async create(
    { body }: CreateCommentRequest,
    res: Response,
  ) {
    if (!(await this.offerService.exists(body.offerId))) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${body.offerId} not found.`,
        "CommentController",
      );
    }

    const result = await this.commentService.create(body);

    const newRating = await this.commentService.getUpdatedAverageRating(body.offerId);
    const updatedOffer = await this.offerService.updateByIdOnNewComment(body.offerId, newRating);

    if (!updatedOffer) {
      throw new HttpError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Offer with id ${body.offerId} was not updated.`,
        "CommentController",
      );
    }

    this.created(res, fillDTO(CommentRdo, result));
  }

  public async findByOfferId(
    { params: { offerId } }: FindCommentsRequest,
    res: Response,
  ) {
    if (!(await this.offerService.exists(offerId))) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        "CommentController",
      );
    }

    const comments = await this.commentService.findByOfferId(offerId);
    console.log(comments);
    this.ok(res, fillDTO(CommentRdo, comments));
  }
}
