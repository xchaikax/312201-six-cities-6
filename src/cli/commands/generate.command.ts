import got from "got";
import { Command } from "../types/command.interface.js";
import { CommandType } from "../types/command-type.enum.js";
import { getErrorMessage } from "../../shared/helpers/index.js";
import { MockServerData } from "../../shared/types/index.js";
import { TSVFileWriter } from "../../shared/libs/file-writer/index.js";
import { TSVOfferGenerator } from "../../shared/libs/offer-generator/index.js";

export class GenerateCommand implements Command {
  private initialData: MockServerData = <MockServerData>{};

  constructor(
    private readonly name: string = CommandType.Generate,
  ) {}

  public getName() {
    return this.name;
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const offerCount = Number.parseInt(count, 10);

    try {
      await this.load(url);
      await this.write(filepath, offerCount);
      console.info(`File ${filepath} was created!`);
    } catch (error: unknown) {
      console.error("Can't generate data");
      console.error(getErrorMessage(error));
    }
  }

  private async load(url: string) {
    try {
      this.initialData = await got.get(url).json();
    } catch {
      throw new Error(`Can't load data from ${url}`);
    }
  }

  private async write(filepath: string, count: number) {
    const tsvOfferGenerator = new TSVOfferGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < count; i++) {
      await tsvFileWriter.write(tsvOfferGenerator.generate());
    }
  }

}
