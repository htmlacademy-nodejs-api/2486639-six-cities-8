import { readFileSync } from 'node:fs';
import { FileReader } from './file-reader.interface.js';
import {
  City, Location, Offer, OFFER_TYPES,
  OfferType, OFFER_GOODS, OfferGood, OfferGoods,
  User, UserType
} from '../../types/index.js';
import { CITIES } from '../../../const.js';
import { getValue } from '../../../utils/common.js';

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

  private parseCity(cityName: string): City {
    //! похожий код на parseType и д.т. только сначала нужно проверить по перечислениею с названием городов, а потом и координатах
    const city = CITIES.find((item) => (item.name === cityName));

    if (!city) {
      throw new Error(`City "${cityName}" not found!`);
    }

    return city;
  }

  private parseImages(images: string): string[] {
    return images.split(';').map((image) => (image));
  }

  private parseNumber(value: string): number {
    return Number.parseInt(value, 10);
  }

  private parseType(type: string): OfferType {
    /*
    //! похожий код
    const offerType = OFFER_TYPES.find((item) => (item === type));

    if (!offerType) {
      throw new Error(`Offer type "${type}" not found!`);
    }

    return offerType;
    */
    return getValue(type, [...OFFER_TYPES]);
  }

  private parseUser(email: string, userType: string, avatarPath: string, firstname: string, lastname: string): User {
    const type = UserType[userType as UserType];

    if (!type) {
      throw new Error(`User type "${userType}" not found!`);
    }

    return { email, type, avatarPath, firstname, lastname };
  }

  private parseLocation(latitude: string, longitude: string): Location {
    return {
      latitude: this.parseNumber(latitude),
      longitude: this.parseNumber(longitude)
    };
  }

  private parseGood(good: string): OfferGood {
    /*
    //! похожий код
    const offerGood = OFFER_GOODS.find((value) => (value === good));

    if (!offerGood) {
      throw new Error(`Offer good "${offerGood}" not found!`);
    }

    return offerGood;*/
    return getValue(good, [...OFFER_GOODS]);
  }

  private parseGoods(goods: string): OfferGoods {
    const offerGoods = new Set<OfferGood>();

    goods.split(';').map(
      (good) => offerGoods.add(this.parseGood(good))
    );

    return offerGoods;
  }

  private parseLineToOffer(line: string, index: number): Offer {
    const [
      title,
      description,
      publishDate,
      city,
      previewImage,
      images,
      isPremium,
      isFavorite,
      rating,
      type,
      rooms,
      maxAdults,
      price,
      goods,
      email,
      userType,
      avatarPath,
      firstname,
      lastname,
      latitude,
      longitude,
    ] = line.split('\t');

    return {
      id: `offer-id-${index + 1}`, //! временно
      title,
      description,
      publishDate,
      city: this.parseCity(city),
      previewImage: previewImage,
      images: this.parseImages(images),
      isPremium: Boolean(isPremium),
      isFavorite: Boolean(isFavorite),
      rating: this.parseNumber(rating),
      type: this.parseType(type),
      rooms: this.parseNumber(rooms),
      maxAdults: this.parseNumber(maxAdults),
      price: this.parseNumber(price),
      goods: this.parseGoods(goods),
      host: this.parseUser(email, userType, avatarPath, firstname, lastname),
      location: this.parseLocation(latitude, longitude)
    };
  }

  private parseRawDataToOffers(): Offer[] {
    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line, index) => this.parseLineToOffer(line, index));
  }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    this.validateRawData();
    return this.parseRawDataToOffers();
  }
}
