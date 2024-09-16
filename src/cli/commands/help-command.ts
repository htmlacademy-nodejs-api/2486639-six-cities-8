import { Command } from './command.interface.js';
import { CommandType, COMMANDS_INFO } from './const.js';

export class HelpCommand implements Command {
  public getName(): string {
    return CommandType.Help;
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(COMMANDS_INFO);
  }
}
