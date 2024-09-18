import { readFileSync } from 'node:fs';
import { FileReader } from './file-reader.interface.js';
import {
  City, Location, Offer, OFFER_TYPES,
  OfferType, OFFER_GOODS, OfferGood, OfferGoods,
  User, UserType, CityName
} from '../../types/index.js';
import { CITY_LOCATIONS } from '../../../const.js';
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

  private parseDate(publishDate: string): Date {
    const convertedDate = new Date(publishDate);

    if (isNaN(convertedDate.getTime())) {
      throw new Error(`Date "${publishDate}" not date!`);
    }

    return convertedDate;
  }

  private parseCity(cityName: string): City {
    //! одинаковый код, тоже бы обернуть дженериком
    const name = CityName[cityName as CityName];

    if (!name) {
      throw new Error(`City "${cityName}" not found!`);
    }

    const { location } = CITY_LOCATIONS[name]; // если появится 7 и т.д. город, то тут будет ошибка, т.к. необходимо заполнить координаты нового города

    return { name, location };
  }

  private parseImages(images: string): string[] {
    return images.split(';').map((image) => (image));
  }

  private parseInteger(value: string): number {
    const convertInteger = Number.parseInt(value, 10);

    if (isNaN(convertInteger)) {
      throw new Error(`String "${value}" is not integer!`);
    }

    return convertInteger;
  }

  private parseFloat(value: string): number {
    const convertFloat = Number.parseFloat(value);

    if (isNaN(convertFloat)) {
      throw new Error(`String "${value}" is not float!`);
    }

    return convertFloat;
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

  private parseUser(name: string, email: string, avatarPath: string, userType: string): User {
    //! одинаковый код, тоже бы обернуть дженериком
    const type = UserType[userType as UserType];

    if (!type) {
      throw new Error(`User type "${userType}" not found!`);
    }

    return {
      name,
      email,
      avatarPath,
      password: '', //! может совсем свойство убрать
      type
    };
  }

  private parseLocation(latitude: string, longitude: string): Location {
    return {
      latitude: this.parseFloat(latitude),
      longitude: this.parseFloat(longitude)
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
      name,
      email,
      avatarPath,
      userType,
      latitude,
      longitude,
    ] = line.split('\t');

    return {
      id: `offer-id-${index + 1}`, //! временно
      title,
      description,
      publishDate: this.parseDate(publishDate),
      city: this.parseCity(city), //! возможно будет только ссылка на имя города
      previewImage: previewImage,
      images: this.parseImages(images),
      isPremium: Boolean(isPremium),
      isFavorite: Boolean(isFavorite),
      rating: this.parseFloat(rating),
      type: this.parseType(type),
      rooms: this.parseInteger(rooms),
      maxAdults: this.parseInteger(maxAdults),
      price: this.parseFloat(price),
      goods: this.parseGoods(goods),
      host: this.parseUser(name, email, avatarPath, userType),
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
