import dayjs from 'dayjs';
import { OfferGenerator } from './offer-generator.interface.js';
import { MockServerData } from '../../types/index.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../helpers/index.js';

const MIN_PRICE = 500;
const MAX_PRICE = 2000;

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) { }

  public generate(): string {
    console.log(this.mockData);

    const categories = getRandomItems<string>(this.mockData.cities).join(';');
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const photo = getRandomItem<string>(this.mockData.cities);
    const type = getRandomItem([1, 2]);
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE).toString();
    const author = getRandomItem(this.mockData.cities);
    const email = getRandomItem(this.mockData.cities);
    const avatar = getRandomItem(this.mockData.cities);

    const createdDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();

    const [firstname, lastname] = author.split(' ');

    return [
      title, description, createdDate,
      photo, type, price, categories,
      firstname, lastname, email, avatar,
    ].join('\t');
  }
}
