import { City } from "./city.enum.js";
import { PropertyType } from "./property-type.enum.js";
import { Facility } from "./facility.enum.js";
import { User } from "./user.type.js";
import { Coordinates } from "./coordinates.type.js";

export type Offer = {
  title: string;
  description: string;
  postDate: Date;
  city: City;
  previewImage: string;
  propertyImages: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  propertyType: PropertyType;
  roomsNumber: number;
  guestsNumber: number;
  price: number;
  facilities: Facility[];
  user: User;
  commentsCount: number;
  coordinates: Coordinates;
}
