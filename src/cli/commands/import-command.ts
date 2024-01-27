import { Command } from "../types/command.interface.js";
import { CommandType } from "../types/command-type.enum.js";
import { TSVFileReader } from "../../shared/libs/file-reader/index.js";
import { createOffer, getErrorMessage } from "../../shared/helpers/index.js";

export class ImportCommand implements Command {
  constructor(
    private readonly name: string = CommandType.Import,
  ) {}

  public getName() {
    return this.name;
  }

  public async execute(...parameters: string[]) {
    const [filename] = parameters;
    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on("line", this.onImportedLine);
    fileReader.on("end", this.onCompleteImport);

    try {
      console.info(`Importing data from file: ${filename}`);
      await fileReader.read();
    } catch (err) {
      console.error(`Can't import data from file: ${filename}`);
      console.error(getErrorMessage(err));
    }
  }

  private onImportedLine(line: string) {
    const offer = createOffer(line);
    console.info(offer);
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported.`);
  }
}
