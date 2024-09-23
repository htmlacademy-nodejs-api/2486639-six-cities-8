import { Command } from './command.interface.js';
import { TSVFileReader } from '#shared/libs/file-reader/index.js';
import { getErrorMessage } from '#shared/helpers/index.js';
import { CommandType } from './const.js';

export class ImportCommand implements Command {
  public getName(): string {
    return CommandType.Import;
  }

  public execute(...parameters: string[]): void {
    const [filename] = parameters;
    const fileReader = new TSVFileReader(filename.trim());

    try {
      fileReader.read();
      console.log(fileReader.toArray());
    } catch (error: unknown) {
      console.error(`Can't import data from file: ${filename}`);
      getErrorMessage(error);
    }
  }
}
