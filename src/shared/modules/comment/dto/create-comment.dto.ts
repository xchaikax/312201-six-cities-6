import { IsMongoId, Max, MaxLength, Min, MinLength } from "class-validator";
import { CommentDtoConstants } from "./comment.constants.js";
import { CommentDtoMessages } from "./comment.messages.js";

export class CreateCommentDto {
  @MinLength(CommentDtoConstants.MIN_TEXT_LENGTH, { message: CommentDtoMessages.text.minLength })
  @MaxLength(CommentDtoConstants.MAX_TEXT_LENGTH, { message: CommentDtoMessages.text.maxLength })
  public text: string;

  @Min(CommentDtoConstants.MIN_RATING, { message: CommentDtoMessages.rating.min })
  @Max(CommentDtoConstants.MAX_RATING, { message: CommentDtoMessages.rating.max })
  public rating: number;

  @IsMongoId({ message: CommentDtoMessages.authorId.invalidFormat })
  public authorId: string;
}
