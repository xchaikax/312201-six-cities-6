import { Command } from "../types/command.interface.js";
import { CommandType } from "../types/command-type.enum.js";
import { TSVFileReader } from "../../shared/libs/file-reader/index.js";

export class ImportCommand implements Command {
  constructor(
    private readonly name: string = CommandType.Import,
  ) {}

  getName() {
    return this.name;
  }

  async execute(...parameters: string[]) {
    const [filename] = parameters;
    const fileReader = new TSVFileReader(filename.trim());

    try {
      fileReader.read();
      console.info(fileReader.toArray());
    } catch (err) {

      if (!(err instanceof Error)) {
        throw err;
      }

      console.error(`Can't import data from file: ${filename}`);
      console.error(`Details: ${err.message}`);
    }
  }
}
