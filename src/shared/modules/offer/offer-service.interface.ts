import { types } from "@typegoose/typegoose";
import { OfferEntity } from "./offer.entity.js";
import { CreateOfferDto } from "./dto/create-offer.dto.js";

export interface OfferService {
  create(dto: CreateOfferDto): Promise<types.DocumentType<OfferEntity>>;
  findById(id: string): Promise<types.DocumentType<OfferEntity> | null>;
}
