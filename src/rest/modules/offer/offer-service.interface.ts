import { types } from "@typegoose/typegoose";
import { City, DocumentExists } from "../../../shared/types/index.js";
import { OfferEntity } from "./offer.entity.js";
import { CreateOfferDto } from "./dto/create-offer.dto.js";
import { UpdateOfferDto } from "./dto/update-offer.dto.js";

export interface OfferService extends DocumentExists {
  create(dto: CreateOfferDto): Promise<types.DocumentType<OfferEntity>>;
  exists(id: string): Promise<boolean>;
  findById(id: string): Promise<types.DocumentType<OfferEntity> | null>;
  updateById(id: string, dto: UpdateOfferDto): Promise<types.DocumentType<OfferEntity> | null>;
  deleteById(id: string): Promise<string | null>;
  findAll(amount?: number): Promise<types.DocumentType<OfferEntity>[]>;
  findPremiumOffersByCity(city: City): Promise<types.DocumentType<OfferEntity>[]>;
  findFavoriteOffersByUserId(userId: string): Promise<types.DocumentType<OfferEntity>[]>;
  updateByIdOnNewComment(id: string, newRating: number): Promise<types.DocumentType<OfferEntity> | null>;
}
