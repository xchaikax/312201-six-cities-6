import "reflect-metadata";
import { Container } from "inversify";
import { RestApplication } from "./rest/index.js";
import { Component } from "./shared/types/index.js";
import { createUserContainer } from "./shared/modules/user/index.js";
import { createRestApplicationContainer } from "./rest/rest.container.js";
import { createOfferContainer, OfferService } from "./shared/modules/offer/index.js";
import { CommentService, createCommentContainer } from "./shared/modules/comment/index.js";
// import { Logger } from "./shared/libs/logger/index.js";
import { generateRandomValue } from "./shared/helpers/index.js";

async function bootstrap() {
  const appContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createOfferContainer(),
    createCommentContainer(),
  );

  const application = appContainer.get<RestApplication>(Component.RestApplication);
  await application.init();

  // const logger = appContainer.get<Logger>(Component.Logger);

  const os = appContainer.get<OfferService>(Component.OfferService);
  const cs = appContainer.get<CommentService>(Component.CommentService);

  await cs.create({
    authorId: "65d2636b5524807cef831d0b",
    offerId: "65d2636b5524807cef831d0d",
    text: "Hello, world!",
    rating: generateRandomValue(1, 5),
  });

  await os.findById("65d2636b5524807cef831d59");

  // logger.info(data as never);
}

bootstrap();
