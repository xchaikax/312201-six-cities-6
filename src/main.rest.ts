import "reflect-metadata";
import { Container } from "inversify";
import { RestApplication } from "./rest/index.js";
import { Component } from "./shared/types/index.js";
import { createUserContainer } from "./rest/modules/user/index.js";
import { createRestApplicationContainer } from "./rest/rest.container.js";
import { createOfferContainer } from "./rest/modules/offer/index.js";
import { createCommentContainer } from "./rest/modules/comment/index.js";
import { createAuthContainer } from "./rest/modules/auth/index.js";

async function bootstrap() {
  const appContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createOfferContainer(),
    createCommentContainer(),
    createAuthContainer(),
  );

  const application = appContainer.get<RestApplication>(Component.RestApplication);
  await application.init();
}

bootstrap();
