import { Container } from "inversify";
import { types } from "@typegoose/typegoose";
import { Component } from "../../../types/index.js";
import { UserService } from "./user-service.interface.js";
import { BaseUserService } from "./user.service.js";
import { UserEntity, UserModel } from "./user.entity.js";

export function createUserContainer() {
  const userContainer = new Container();

  userContainer.bind<UserService>(Component.UserService).to(BaseUserService).inSingletonScope();
  userContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);

  return userContainer;
}
