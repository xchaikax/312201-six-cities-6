import { types } from "@typegoose/typegoose";
import { injectable, inject } from "inversify";
import { City, Component, Sorting } from "../../types/index.js";
import { Logger } from "../../libs/logger/index.js";
import { OfferService } from "./offer-service.interface.js";
import { CreateOfferDto } from "./dto/create-offer.dto.js";
import { OfferEntity } from "./offer.entity.js";
import { UpdateOfferDto } from "./dto/update-offer.dto.js";
import { OFFERS_AMOUNT_LIMIT, PREMIUM_OFFERS_AMOUNT_LIMIT } from "./offer.constants.js";

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
    return await this.offerModel.findById(id).populate("authorId").exec();
  }

  public async exists(id: string): Promise<boolean> {
    return !!(await this.offerModel.exists({ _id: id }));
  }

  updateById(id: string, dto: UpdateOfferDto): Promise<types.DocumentType<OfferEntity> | null> {
    const updatedOffer = this.offerModel
      .findByIdAndUpdate(id, dto, { new: true })
      .populate("authorId")
      .exec();

    this.logger.info(`Offer with id ${id} was updated`);

    return updatedOffer;
  }

  public async deleteById(id: string): Promise<string | null> {
    const deletedOffer = await this.offerModel.findByIdAndDelete(id).exec();

    this.logger.info(`Offer with id ${id} was deleted`);

    return deletedOffer?.id;
  }

  public async findAll(amount?: number): Promise<types.DocumentType<OfferEntity>[]> {
    const limit = amount || OFFERS_AMOUNT_LIMIT;

    return await this.offerModel
      .aggregate([
        { $limit: limit },
        { $lookup: { from: "users", localField: "authorId", foreignField: "_id", as: "author" } },
        { $unwind: "$author" },
      ]);
  }

  public async findPremiumOffersByCity(city: City): Promise<types.DocumentType<OfferEntity>[]> {
    return await this.offerModel
      .aggregate([
        { $match: { city, isPremium: true } },
        { $sort: { createdAt: Sorting.Descending } },
        { $limit: PREMIUM_OFFERS_AMOUNT_LIMIT },
      ]).exec();
  }

  public async updateByIdOnNewComment(id: string, newRating: number): Promise<types.DocumentType<OfferEntity> | null> {
    return await this.offerModel.findByIdAndUpdate(id, { $inc: { commentsCount: 1 }, rating: newRating }, { new: true }).exec();
  }
}
