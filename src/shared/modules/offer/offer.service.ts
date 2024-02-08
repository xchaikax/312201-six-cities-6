import { types } from "@typegoose/typegoose";
import { injectable, inject } from "inversify";
import { Component } from "../../types/index.js";
import { Logger } from "../../libs/logger/index.js";
import { OfferService } from "./offer-service.interface.js";
import { CreateOfferDto } from "./dto/create-offer.dto.js";
import { OfferEntity } from "./offer.entity.js";

@injectable()
export class BaseOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
  ) {}

  public async create(dto: CreateOfferDto): Promise<types.DocumentType<OfferEntity>> {
    const offer = await this.offerModel.create(dto);

    this.logger.info(`Offer with id ${offer.id} was created`);

    return offer;
  }

  public async findById(id: string): Promise<types.DocumentType<OfferEntity> | null> {
    return await this.offerModel.findById(id);
  }
}
