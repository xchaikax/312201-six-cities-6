import { Expose, Type } from "class-transformer";
import { User } from "../../../types/index.js";
import { UserRdo } from "../../user/rdo/user.rdo.js";

export class CommentRdo {
  @Expose({ name: "_id" })
  @Type(() => String)
  public id: string;

  @Expose()
  public text: string;

  @Expose()
  public rating: number;

  @Type(() => UserRdo)
  @Expose()
  public author: User;

  @Expose()
  @Type(() => String)
  public offerId: string;
}
