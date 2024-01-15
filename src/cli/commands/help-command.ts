import chalk from "chalk";
import { Command } from "../types/command.interface.js";
import { CommandType } from "../types/command-type.enum.js";

export class HelpCommand implements Command {
  constructor(
    private readonly name: string = CommandType.Help
  ) {}

  public getName() {
    return this.name;
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(`
        Программа для подготовки данных для REST API сервера.

        Пример:
          main.cli.js --<${chalk.blue("command")}> [${chalk.green("--arguments")}]

        Команды:
            ${chalk.blue("--version")}                           ${chalk.magenta("# выводит номер версии")}
            ${chalk.blue("--help")}                              ${chalk.magenta("# печатает этот текст")}
            ${chalk.blue("--import")} ${chalk.green("<path>")}                     ${chalk.magenta("# импортирует данные из TSV")}
            ${chalk.blue("--generate")} ${chalk.green("<n> <path> <url>")}         ${chalk.magenta("# генерирует произвольное количество тестовых данных")}
    `);
  }
}
