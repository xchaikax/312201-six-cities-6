import { IsLatitude, IsLongitude } from "class-validator";
import { Coordinates } from "../../../types/index.js";
import { OfferDtoMessages } from "./offer-dto.messages.js";

export class CoordinatesDto implements Coordinates {
  @IsLatitude({ message: OfferDtoMessages.coordinates.latitude.invalidFormat })
    latitude: number;

  @IsLongitude({ message: OfferDtoMessages.coordinates.longitude.invalidFormat })
    longitude: number;
}
