import { OfferGenerator } from './offer-generator.interface.js';
import {
  CityName, MockServerData, OFFER_GOODS, OFFER_TYPES,
  randomNumberOption, UserType
} from '../../types/index.js';
import {
  getRandomNumber, getRandomBoolean, getRandomDate, getRandomItem,
  round, getRandomItems, getRandomObjectKey
} from '../../helpers/index.js';
import { CityLocation } from '../../../const.js';

const IMAGES_COUNT = 6;

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) { }

  private getRandomNumber({ min, max, numAfterDigit }: randomNumberOption): number {
    return getRandomNumber(min, max, numAfterDigit);
  }

  public generate(): string {
    const { mockData } = this;
    const { deltaCityLocation } = mockData;
    const cityName = getRandomObjectKey(CityName);
    const location = CityLocation[cityName];

    const title = getRandomItem(mockData.titles);
    const description = getRandomItem(mockData.descriptions);
    const publishDate = getRandomDate(mockData.publishDate.min, mockData.publishDate.max).toISOString();
    const previewImage = getRandomItem(mockData.previewImages);
    const images = getRandomItems(mockData.images, IMAGES_COUNT, IMAGES_COUNT).join(';');
    const isPremium = getRandomBoolean();
    const rating = this.getRandomNumber(mockData.rating);
    const type = getRandomItem([...OFFER_TYPES]);
    const rooms = this.getRandomNumber(mockData.rooms);
    const maxAdults = this.getRandomNumber(mockData.maxAdults);
    const price = this.getRandomNumber(mockData.price);
    const goods = getRandomItems([...OFFER_GOODS], getRandomNumber(0, OFFER_GOODS.length), 0).join(';');
    const name = getRandomItem(mockData.user.names);
    const email = getRandomItem(mockData.user.emails);
    const avatarPath = getRandomItem(mockData.user.avatarPaths);
    const userType = getRandomObjectKey(UserType);
    const latitude = round(location.latitude + this.getRandomNumber(deltaCityLocation.latitude), deltaCityLocation.latitude.numAfterDigit);
    const longitude = round(location.longitude + this.getRandomNumber(deltaCityLocation.longitude), deltaCityLocation.latitude.numAfterDigit);

    return [
      title,
      description,
      publishDate,
      cityName,
      previewImage,
      images,
      isPremium,
      rating,
      type,
      rooms,
      maxAdults,
      price,
      goods,
      name,
      email,
      avatarPath,
      userType,
      latitude,
      longitude
    ].join('\t');
  }
}
