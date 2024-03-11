import { Container } from "inversify";
import { types } from "@typegoose/typegoose";
import { Component } from "../../../shared/types/index.js";
import { OfferService } from "./offer-service.interface.js";
import { BaseOfferService } from "./offer.service.js";
import { OfferEntity, OfferModel } from "./offer.entity.js";
import { OfferController } from "./offer.controller.js";

export function createOfferContainer() {
  const offerContainer = new Container();

  offerContainer.bind<OfferService>(Component.OfferService).to(BaseOfferService).inSingletonScope();
  offerContainer.bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);
  offerContainer.bind<OfferController>(Component.OfferController).to(OfferController).inSingletonScope();

  return offerContainer;
}
