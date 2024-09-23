import { readFileSync } from 'node:fs';
import { FileReader } from './file-reader.interface.js';
import { TSVOfferParser } from '#shared/libs/offer-parser/index.js';
import { Offer } from '#shared/types/index.js';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) { }

  private validateRawData(): void {
    if (!this.rawData) {
      throw new Error('File was not read');
    }
  }

  private parseRawDataToOffers(): Offer[] {
    const offerParser = new TSVOfferParser();

    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line, index) => offerParser.parse(line, `offer-id-${index + 1}`));
  }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    this.validateRawData();
    return this.parseRawDataToOffers();
  }
}
