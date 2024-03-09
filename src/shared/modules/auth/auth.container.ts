import { Container } from "inversify";
import { Component } from "../../types/index.js";
import { ExceptionFilter } from "../../libs/rest/index.js";
import { AuthService } from "./auth-service.interface.js";
import { BaseAuthService } from "./auth.service.js";
import { AuthExceptionFilter } from "./auth.exception-filter.js";

export function createAuthContainer() {
  const authContainer = new Container();

  authContainer.bind<AuthService>(Component.AuthService).to(BaseAuthService).inSingletonScope();
  authContainer.bind<ExceptionFilter>(Component.AuthExceptionFilter).to(AuthExceptionFilter).inSingletonScope();

  return authContainer;
}
