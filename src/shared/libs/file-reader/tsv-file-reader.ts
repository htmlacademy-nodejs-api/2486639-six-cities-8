import { readFileSync } from 'node:fs';
import { FileReader } from './file-reader.interface.js';
import {
  City, Location, Offer, OFFER_TYPES,
  OfferType, OFFER_GOODS, OfferGood, OfferGoods,
  User, UserType, CityName
} from '#shared/types/index.js';
import { CITY_LOCATIONS } from '#const.js';

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

  private validateValueInArray(value: string, items: string[]) {
    if (!items.includes(value)) {
      throw new Error(`Value "${value}" not found in "${items.join(', ')}"!`);
    }
  }

  private validateValueInObject(value: string, dictionary: object) {
    this.validateValueInArray(value, Object.values(dictionary));
  }

  private parseCity(cityName: string): City {
    this.validateValueInObject(cityName, CityName);

    const name = cityName as CityName;
    const { location } = CITY_LOCATIONS[name]; // если появится 7й и т.д. город, то тут будет ошибка компиляции, т.к. необходимо заполнить координаты нового города

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

  private parseOfferType(offerType: string): OfferType {
    this.validateValueInArray(offerType, [...OFFER_TYPES]);

    return offerType as OfferType;
  }

  private parseUser(name: string, email: string, avatarPath: string, userType: string): User {
    this.validateValueInObject(userType, UserType);
    //! одинаковый код, тоже бы обернуть дженериком но enum это не type, а фактически Object, а если в enum key!==value, Property 'Ordinary12345' does not exist on type 'typeof UserType'.
    const type = userType as UserType;

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

  private parseOfferGood(offerGood: string): OfferGood {
    this.validateValueInArray(offerGood, [...OFFER_GOODS]);

    return offerGood as OfferGood;
  }

  private parseOfferGoods(goods: string): OfferGoods {
    const offerGoods = new Set<OfferGood>();

    goods.split(';').map(
      (good) => offerGoods.add(this.parseOfferGood(good))
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
      type: this.parseOfferType(type),
      rooms: this.parseInteger(rooms),
      maxAdults: this.parseInteger(maxAdults),
      price: this.parseFloat(price),
      goods: this.parseOfferGoods(goods),
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
