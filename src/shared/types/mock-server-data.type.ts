import { City } from "./city.type.js";
import { PropertyType } from "./property-type.enum.js";
import { Facility } from "./facility.enum.js";
import { User } from "./user.type.js";

export type MockServerData = {
  titles: string[];
  descriptions: string[];
  cities: {
    name: City;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  }[];
  previewImages: string[];
  images: string[][];
  propertyTypes: PropertyType[];
  facilities: Facility[];
  users: User[];
}
