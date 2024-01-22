import chalk from "chalk";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Command } from "../types/command.interface.js";
import { CommandType } from "../types/command-type.enum.js";

type PackageJSONConfig = {
  version: string;
}

export class VersionCommand implements Command {
  constructor(
    private readonly filePath: string = "./package.json",
    private readonly name: string = CommandType.Version,
  ) {}

  public getName() {
    return this.name;
  }

  async execute(..._parameters: string[]) {
    try {
      const version = this.readVersion();
      console.info(chalk.blue(`v${version}`));
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error;
      }

      console.error(`Failed to read version from ${this.filePath}`);
      console.error(error.message);
    }
  }

  private readVersion(): string {
    const jsonContent = readFileSync(resolve(this.filePath), { encoding: "utf-8" });
    const importedContent = JSON.parse(jsonContent);

    if (!this.isPackageJSONConfig(importedContent)) {
      throw new Error("Failed to parse package.json content.");
    }

    return importedContent.version;
  }

  private isPackageJSONConfig(value: unknown): value is PackageJSONConfig {
    return (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      Object.hasOwn(value, "version")
    );
  }
}
