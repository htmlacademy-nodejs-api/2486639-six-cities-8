import got from 'got';
import { Command } from './command.interface.js';
import { TSVOfferGenerator } from '#src/shared/libs/offer-generator/index.js';
import { TSVFileWriter } from '#src/shared/libs/file-writer/index.js';
import { getErrorMessage } from '#src/shared/helpers/index.js';
import { MockServerData } from '#src/shared/types/index.js';
import { CommandType } from './const.js';

export class GenerateCommand implements Command {
  private initialData: MockServerData;

  private async loadMockData(url: string) {
    try {
      this.initialData = await got.get(url).json();
    } catch {
      throw new Error(`Can't load mock data from ${url}`);
    }
  }

  public getName(): string {
    return CommandType.Generate;
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const offerCount = Number.parseInt(count, 10);

    try {
      await this.loadMockData(url);

      const tsvOfferGenerator = new TSVOfferGenerator(this.initialData);
      const tsvFileWriter = new TSVFileWriter(filepath);

      for (let i = 0; i < offerCount; i++) {
        await tsvFileWriter.write(tsvOfferGenerator.generate());
      }

      console.info(`File ${filepath} was created!`);
    } catch (error: unknown) {
      console.error('Can\'t generate data');
      console.error(getErrorMessage(error));
    }
  }
}
