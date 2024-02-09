import { Command } from "../types/command.interface.js";
import { CommandType } from "../types/command-type.enum.js";
import { TSVFileReader } from "../../shared/libs/file-reader/index.js";
import {
  createOffer,
  generateRandomString,
  generateRandomValue,
  getErrorMessage,
  getMongoURI,
} from "../../shared/helpers/index.js";
import { ConsoleLogger } from "../../shared/libs/logger/console.logger.js";
import { RestConfig } from "../../shared/libs/config/index.js";
import { BaseUserService, UserModel, UserService } from "../../shared/modules/user/index.js";
import { BaseOfferService, OfferModel, OfferService } from "../../shared/modules/offer/index.js";
import { DatabaseClient, MongoDatabaseClient } from "../../shared/libs/database-client/index.js";
import { Logger } from "../../shared/libs/logger/index.js";
import { Offer } from "../../shared/types/index.js";

export class ImportCommand implements Command {
  private readonly config: RestConfig;
  private readonly logger: Logger;
  private readonly userService: UserService;
  private readonly offerService: OfferService;
  private readonly databaseClient: DatabaseClient;
  private salt: string;

  constructor(
    private readonly name: string = CommandType.Import,
  ) {
    this.logger = new ConsoleLogger();
    this.config = new RestConfig(this.logger);
    this.userService = new BaseUserService(this.logger, UserModel);
    this.offerService = new BaseOfferService(this.logger, OfferModel);
    this.databaseClient = new MongoDatabaseClient(this.logger);
  }

  public getName() {
    return this.name;
  }

  public async execute(filename: string) {
    const uri = getMongoURI(
      this.config.get("DB_USER"),
      this.config.get("DB_PASSWORD"),
      this.config.get("DB_HOST"),
      this.config.get("DB_PORT"),
      this.config.get("DB_NAME"),
    );

    this.salt = this.config.get("SALT");

    await this.databaseClient.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on("line", this.onImportedLine);
    fileReader.on("end", this.onCompleteImport);

    try {
      this.logger.info(`Importing data from file: ${filename}`);
      await fileReader.read();
    } catch (err) {
      this.logger.info(`Can't import data from file: ${filename}`);
      this.logger.error(getErrorMessage(err), err as Error);
    }
  }

  private onImportedLine = async (line: string, resolver: () => void) => {
    const offer = createOffer(line);
    await this.saveOffer(offer);
    this.logger.info(JSON.stringify(offer));
    resolver();
  };

  private onCompleteImport = async (count: number) => {
    this.logger.info(`${count} rows imported.`);
    await this.databaseClient.disconnect();
  };

  private saveOffer = async (offer: Offer) => {
    const user = await this.userService.findOrCreate({
      ...offer.user,
      password: generateRandomString(generateRandomValue(6, 12)),
    }, this.salt);

    await this.offerService.create({
      ...offer,
      user: user.id,
    });
  };
}
