import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
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

export class UpdateOfferDto {
  @IsOptional()
  @IsString({ message: OfferDtoMessages.title.invalidFormat })
  @MinLength(OfferDtoConstants.MIN_TITLE_LENGTH, { message: OfferDtoMessages.title.minLength })
  @MaxLength(OfferDtoConstants.MAX_TITLE_LENGTH, { message: OfferDtoMessages.title.maxLength })
  public title: string;

  @IsOptional()
  @IsString({ message: OfferDtoMessages.description.invalidFormat })
  @MinLength(OfferDtoConstants.MIN_DESCRIPTION_LENGTH, { message: OfferDtoMessages.description.minLength })
  @MaxLength(OfferDtoConstants.MAX_DESCRIPTION_LENGTH, { message: OfferDtoMessages.description.maxLength })
  public description: string;

  @IsOptional()
  @IsEnum(City, { message: OfferDtoMessages.city.invalidFormat })
  public city: City;

  @IsOptional()
  @IsString({ message: OfferDtoMessages.previewImage.invalidFormat })
  public previewImage: string;

  @IsOptional()
  @IsArray({ message: OfferDtoMessages.images.invalidFormat })
  @ArrayMinSize(OfferDtoConstants.IMAGES_NUMBER, { message: OfferDtoMessages.images.invalidFormat })
  @ArrayMaxSize(OfferDtoConstants.IMAGES_NUMBER, { message: OfferDtoMessages.images.invalidFormat })
  public images: string[];

  @IsOptional()
  @IsBoolean({ message: OfferDtoMessages.isPremium.invalidFormat })
  public isPremium: boolean;

  @IsOptional()
  @IsEnum(PropertyType, { message: OfferDtoMessages.propertyType.invalidFormat })
  public propertyType: PropertyType;

  @IsOptional()
  @IsInt({ message: OfferDtoMessages.roomsNumber.invalidFormat })
  @Min(OfferDtoConstants.MIN_ROOMS_NUMBER, { message: OfferDtoMessages.roomsNumber.min })
  @Max(OfferDtoConstants.MAX_ROOMS_NUMBER, { message: OfferDtoMessages.roomsNumber.max })
  public roomsNumber: number;

  @IsOptional()
  @IsInt({ message: OfferDtoMessages.guestsNumber.invalidFormat })
  @Min(OfferDtoConstants.MIN_GUESTS_NUMBER, { message: OfferDtoMessages.guestsNumber.min })
  @Max(OfferDtoConstants.MAX_GUESTS_NUMBER, { message: OfferDtoMessages.guestsNumber.max })
  public guestsNumber: number;

  @IsOptional()
  @IsInt({ message: OfferDtoMessages.price.invalidFormat })
  @Min(OfferDtoConstants.MIN_PRICE, { message: OfferDtoMessages.price.min })
  @Max(OfferDtoConstants.MAX_PRICE, { message: OfferDtoMessages.price.max })
  public price: number;

  @IsOptional()
  @IsArray({ message: OfferDtoMessages.facilities.invalidFormat })
  @IsEnum(Facility, { each: true, message: OfferDtoMessages.facilities.each })
  public facilities: Facility[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  public coordinates: CoordinatesDto;
}
