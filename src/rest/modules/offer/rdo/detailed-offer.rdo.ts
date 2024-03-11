import { Expose, Type } from "class-transformer";
import { UserRdo } from "../../user/rdo/user.rdo.js";
import { OfferRdo } from "./offer.rdo.js";
import { Facility, Coordinates } from "../../../../shared/types/index.js";

export class DetailedOfferRdo extends OfferRdo {
  @Expose()
  public description: string;

  @Expose()
  public images: string[];

  @Expose()
  public roomsNumber: number;

  @Expose()
  public guestsNumber: number;

  @Expose()
  public facilities: Facility[];

  @Type(() => UserRdo)
  @Expose()
  public author: UserRdo;

  @Expose()
  public coordinates: Coordinates;
}
