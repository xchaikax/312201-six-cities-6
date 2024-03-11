import { Expose, Type } from "class-transformer";
import { UserType } from "../../../../shared/types/index.js";

export class UserRdo {
  @Expose({ name: "_id" })
  @Type(() => String)
  public id: string;

  @Expose()
  public name: string;

  @Expose()
  public email: string ;

  @Expose()
  public avatar: string;

  @Expose()
  public userType: UserType;
}
