import { types } from "@typegoose/typegoose";
import { CreateCommentDto } from "./dto/create-comment.dto.js";
import { CommentEntity } from "./comment.entity.js";

export interface CommentService {
  create(dto: CreateCommentDto): Promise<types.DocumentType<CommentEntity>>;
  findByOfferId(offerId: string): Promise<types.DocumentType<CommentEntity>[]>;
  getUpdatedAverageRating(offerId: string): Promise<number>;
}
