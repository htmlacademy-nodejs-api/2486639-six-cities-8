import chalk from 'chalk';
import { Command } from './command.interface.js';
import { getPackageVersion } from '../../utils/package-json-config.js';
import { CommandType } from './const.js';

export class VersionCommand implements Command {

  public getName(): string {
    return CommandType.Version;
  }

  public async execute(..._parameters: string[]): Promise<void> {
    try {
      const version = getPackageVersion();
      console.info(chalk.green(version));
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }
}
