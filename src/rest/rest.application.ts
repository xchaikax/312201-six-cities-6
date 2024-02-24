import { inject, injectable } from "inversify";
import express, { Express } from "express";
import { Logger } from "../shared/libs/logger/index.js";
import { Config, RestSchema } from "../shared/libs/config/index.js";
import { Component } from "../shared/types/index.js";
import { DatabaseClient } from "../shared/libs/database-client/index.js";
import { getMongoURI } from "../shared/helpers/index.js";
import { Controller, ExceptionFilter } from "../shared/libs/rest/index.js";

@injectable()
export class RestApplication {
  private readonly server: Express;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
    @inject(Component.ExceptionFilter) private readonly exceptionFilter: ExceptionFilter,
    @inject(Component.UserController) private readonly userController: Controller,
    @inject(Component.CommentController) private readonly commentController: Controller,
  ) {
    this.server = express();
  }

  public async init() {
    this.logger.info("Application initialization...");

    this.logger.info("Init database…");
    await this.initDb();
    this.logger.info("Init database completed");

    this.logger.info("Init app-level middleware...");
    await this.initMiddleware();
    this.logger.info("App-level middleware initialization completed");

    this.logger.info("Init controllers...");
    await this.initControllers();
    this.logger.info("Controllers initialization completed");

    this.logger.info("Init exception filters...");
    await this.initExceptionFilters();
    this.logger.info("Exception filters initialization completed");

    this.logger.info("Init server…");
    await this.initServer();
    this.logger.info("Server initialization completed");
    this.logger.info(`🚀 Server started on http://localhost:${this.config.get("PORT")}`);

    this.logger.info("Application initialization completed");
  }

  private async initServer() {
    const port = this.config.get("PORT");
    this.server.listen(port);
  }

  private async initControllers() {
    this.server.use("/users", this.userController.router);
    this.server.use("/comments", this.commentController.router);
  }

  private async initMiddleware() {
    this.server.use(express.json());
  }

  private async initExceptionFilters() {
    this.server.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  private async initDb() {
    const mongoUri = getMongoURI(
      this.config.get("DB_USER"),
      this.config.get("DB_PASSWORD"),
      this.config.get("DB_HOST"),
      this.config.get("DB_PORT"),
      this.config.get("DB_NAME"),
    );

    return this.databaseClient.connect(mongoUri);
  }
}
