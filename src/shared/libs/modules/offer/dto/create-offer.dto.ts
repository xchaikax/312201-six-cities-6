import { City, Facility, PropertyType, User } from "../../../../types/index.js";
import { Coordinates } from "../../../../types/coordinates.type.js";

export class CreateOfferDto {
  public title: string;
  public description: string;
  public createdDate: Date;
  public city: City;
  public previewImage: string;
  public images: string[];
  public isPremium: boolean;
  public isFavorite: boolean;
  public rating: number;
  public propertyType: PropertyType;
  public roomsNumber: number;
  public guestsNumber: number;
  public price: number;
  public facilities: Facility[];
  public user: User;
  public commentsCount: number;
  public coordinates: Coordinates;
}
