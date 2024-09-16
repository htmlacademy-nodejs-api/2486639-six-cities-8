import chalk from 'chalk';
import { Command } from './command.interface.js';
import { CommandType, CommandTypeInfo, CommandTypeParams, EXAMPLE, HELP_TEXT, MAX_SPACE_COUNT } from './const.js';

export class HelpCommand implements Command {
  public getName(): string {
    return CommandType.Help;
  }

  public async execute(..._parameters: string[]): Promise<void> {
    const exampleText = `${HELP_TEXT.Example}:\n  ${chalk.green(EXAMPLE)}`;

    const commandsText = Object.values(CommandType).map(
      (commandType) => {
        const command = chalk.blue(commandType);
        const commandTypeParams = CommandTypeParams[commandType];
        const commandParams = chalk.gray(commandTypeParams);
        const commandInfo = chalk.yellow(`- ${CommandTypeInfo[commandType]}`);
        const space = Array.from({ length: MAX_SPACE_COUNT - commandType.length - commandTypeParams.length }).join(' ');
        const line = `  ${command} ${commandParams} ${space}${commandInfo} \n`;

        return line;
      }
    ).join('');

    console.info(`${chalk.bgGreen(HELP_TEXT.Info)} \n${exampleText} \n${HELP_TEXT.Commands}: \n${commandsText}`);
  }
}
