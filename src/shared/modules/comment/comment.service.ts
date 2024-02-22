import { types } from "@typegoose/typegoose";
import * as mongoose from "mongoose";
import { injectable, inject } from "inversify";
import { Component, Sorting } from "../../types/index.js";
import { Logger } from "../../libs/logger/index.js";
import { CommentService } from "./comment-service.interface.js";
import { CreateCommentDto } from "./dto/create-comment.dto.js";
import { CommentEntity } from "./comment.entity.js";
import { COMMENTS_AMOUNT_LIMIT } from "./comment.constants.js";

@injectable()
export class BaseCommentService implements CommentService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
  ) {}

  public async create(dto: CreateCommentDto): Promise<types.DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);

    this.logger.info(`Comment with id ${comment.id} was created`);

    return comment.populate("authorId");
  }

  public async findByOfferId(offerId: string): Promise<types.DocumentType<CommentEntity>[]> {
    const result = await this.commentModel
      .find({ offerId })
      .limit(COMMENTS_AMOUNT_LIMIT)
      .sort({ createdAt: Sorting.Descending })
      .populate(["authorId", "offerId"])
      .exec();

    this.logger.info(`Number of comments for offer ${offerId}: ${result.length}`);
    return result;
  }

  public async getAverageRating(offerId: string): Promise<number> {
    const [{ rating }] = await this.commentModel.aggregate([
      { $match: { offerId: new mongoose.Types.ObjectId(offerId) } },
      {
        $group: {
          _id: null,
          totalRating: { $sum: "$rating" },
          totalComments: { $sum: 1 },
        },
      },
      {
        $project: {
          rating: { $divide: ["$totalRating", "$totalComments"] },
        },
      },
    ]);

    return Number(rating.toFixed(1));
  }
}