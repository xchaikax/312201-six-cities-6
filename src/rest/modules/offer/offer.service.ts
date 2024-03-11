import { types } from "@typegoose/typegoose";
import { injectable, inject } from "inversify";
import { City, Component, Sorting } from "../../../shared/types/index.js";
import { Logger } from "../../../shared/libs/logger/index.js";
import { OfferService } from "./offer-service.interface.js";
import { CreateOfferDto } from "./dto/create-offer.dto.js";
import { OfferEntity } from "./offer.entity.js";
import { UpdateOfferDto } from "./dto/update-offer.dto.js";
import { PREMIUM_OFFERS_AMOUNT_LIMIT } from "./offer.constants.js";
import { UserEntity } from "../user/index.js";

@injectable()
export class BaseOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>,
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

  public async updateById(id: string, dto: UpdateOfferDto): Promise<types.DocumentType<OfferEntity> | null> {
    const updatedOffer = await this.offerModel
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

  public async findAll(amount: number): Promise<types.DocumentType<OfferEntity>[]> {
    return await this.offerModel
      .aggregate([
        { $limit: amount },
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

  public async findFavoriteOffersByUserId(userId: string): Promise<types.DocumentType<OfferEntity>[]> {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    return await this.offerModel.find({ _id: { $in: user.favorites } }).exec() || [];
  }

  public async updateByIdOnNewComment(id: string, newRating: number): Promise<types.DocumentType<OfferEntity> | null> {
    return await this.offerModel.findByIdAndUpdate(id, { $inc: { commentsCount: 1 }, rating: newRating }, { new: true }).exec();
  }
}
