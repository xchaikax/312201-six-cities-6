import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { City, Facility, PropertyType } from "../../../types/index.js";
import { OfferDtoMessages } from "./offer-dto.messages.js";
import { OfferDtoConstants } from "./offer-dto.constants.js";
import { CoordinatesDto } from "./coordinates.dto.js";

export class CreateOfferDto {
  @IsString({ message: OfferDtoMessages.title.invalidFormat })
  @MinLength(OfferDtoConstants.MIN_TITLE_LENGTH, { message: OfferDtoMessages.title.minLength })
  @MaxLength(OfferDtoConstants.MAX_TITLE_LENGTH, { message: OfferDtoMessages.title.maxLength })
  public title: string;

  @IsString({ message: OfferDtoMessages.description.invalidFormat })
  @MinLength(OfferDtoConstants.MIN_DESCRIPTION_LENGTH, { message: OfferDtoMessages.description.minLength })
  @MaxLength(OfferDtoConstants.MAX_DESCRIPTION_LENGTH, { message: OfferDtoMessages.description.maxLength })
  public description: string;

  @IsDate({ message: OfferDtoMessages.createdDate.invalidFormat })
  public createdDate: Date;

  @IsEnum(City, { message: OfferDtoMessages.city.invalidFormat })
  public city: City;

  @IsString({ message: OfferDtoMessages.previewImage.invalidFormat })
  public previewImage: string;

  @IsArray({ message: OfferDtoMessages.images.invalidFormat })
  @ArrayMinSize(OfferDtoConstants.IMAGES_NUMBER, { message: OfferDtoMessages.images.invalidFormat })
  @ArrayMaxSize(OfferDtoConstants.IMAGES_NUMBER, { message: OfferDtoMessages.images.invalidFormat })
  public images: string[];

  @IsBoolean({ message: OfferDtoMessages.isPremium.invalidFormat })
  public isPremium: boolean;

  @IsEnum(PropertyType, { message: OfferDtoMessages.propertyType.invalidFormat })
  public propertyType: PropertyType;

  @IsInt({ message: OfferDtoMessages.roomsNumber.invalidFormat })
  @Min(OfferDtoConstants.MIN_ROOMS_NUMBER, { message: OfferDtoMessages.roomsNumber.min })
  @Max(OfferDtoConstants.MAX_ROOMS_NUMBER, { message: OfferDtoMessages.roomsNumber.max })
  public roomsNumber: number;

  @IsInt({ message: OfferDtoMessages.guestsNumber.invalidFormat })
  @Min(OfferDtoConstants.MIN_GUESTS_NUMBER, { message: OfferDtoMessages.guestsNumber.min })
  @Max(OfferDtoConstants.MAX_GUESTS_NUMBER, { message: OfferDtoMessages.guestsNumber.max })
  public guestsNumber: number;

  @IsInt({ message: OfferDtoMessages.price.invalidFormat })
  @Min(OfferDtoConstants.MIN_PRICE, { message: OfferDtoMessages.price.min })
  @Max(OfferDtoConstants.MAX_PRICE, { message: OfferDtoMessages.price.max })
  public price: number;

  @IsArray({ message: OfferDtoMessages.facilities.invalidFormat })
  @IsEnum(Facility, { each: true, message: OfferDtoMessages.facilities.each })
  public facilities: Facility[];

  @IsString({ message: OfferDtoMessages.authorId.invalidFormat })
  public authorId: string;

  @ValidateNested()
  @Type(() => CoordinatesDto)
  public coordinates: CoordinatesDto;
}
