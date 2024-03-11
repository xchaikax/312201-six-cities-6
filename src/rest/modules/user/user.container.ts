import { Container } from "inversify";
import { types } from "@typegoose/typegoose";
import { Component } from "../../../shared/types/index.js";
import { Controller } from "../../../shared/libs/rest/index.js";
import { UserService } from "./user-service.interface.js";
import { BaseUserService } from "./user.service.js";
import { UserEntity, UserModel } from "./user.entity.js";
import { UserController } from "./user.controller.js";

export function createUserContainer() {
  const userContainer = new Container();

  userContainer.bind<UserService>(Component.UserService).to(BaseUserService).inSingletonScope();
  userContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
  userContainer.bind<Controller>(Component.UserController).to(UserController).inSingletonScope();

  return userContainer;
}
