import { defaultClasses, getModelForClass, prop, modelOptions, PropType, Ref } from "@typegoose/typegoose";
import { City, Facility, PropertyType } from "../../types/index.js";
import { Coordinates } from "../../types/index.js";
import { UserEntity } from "../user/index.js";

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: "offers",
    timestamps: true,
  },
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ required: true, minlength: 10, maxlength: 100, trim: true })
  public title!: string;

  @prop({ required: true, minlength: 20, maxlength: 1024, trim: true })
  public description!: string;

  @prop({ required: true })
  public createdDate!: Date;

  @prop({ required: true, type: () => String, enum: City })
  public city!: City;

  @prop({ required: true })
  public previewImage!: string;

  @prop({ required: true, type: () => [String] }, PropType.ARRAY)
  public images!: string[];

  @prop({ required: true })
  public isPremium!: boolean;

  @prop({ required: false, min: 1, max: 5, default: null })
  public rating!: number;

  @prop({ required: true, enum: PropertyType })
  public propertyType!: PropertyType;

  @prop({ required: true, min: 1, max: 8 })
  public roomsNumber!: number;

  @prop({ required: true, min: 1, max: 10 })
  public guestsNumber!: number;

  @prop({ required: true, min: 100, max: 100000 })
  public price!: number;

  @prop({ required: true, type: () => [String], enum: Facility, default: [] }, PropType.ARRAY)
  public facilities!: Facility[];

  @prop({ required: true, ref: UserEntity })
  public authorId!: Ref<UserEntity>;

  @prop({ required: false, default: 0 })
  public commentsCount?: number;

  @prop({ required: true })
  public coordinates: Coordinates;
}

export const OfferModel = getModelForClass(OfferEntity);
