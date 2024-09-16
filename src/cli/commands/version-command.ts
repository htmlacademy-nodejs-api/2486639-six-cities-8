import { Command } from './command.interface.js';
import { CommandType } from './const.js';
import { getPackageVersion } from '../../utils/package-json-config.js';

export class VersionCommand implements Command {

  public getName(): string {
    return CommandType.Version;
  }

  public async execute(..._parameters: string[]): Promise<void> {
    try {
      const version = getPackageVersion();
      console.info(version);
    } catch (error: unknown) {
      //! } catch (error: Error) {  ?
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }
}
