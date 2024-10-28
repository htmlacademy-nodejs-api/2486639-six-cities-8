import { OfferParser } from './offer-parser.interface.js';
import {
  Location, Offer, OFFER_TYPES,
  OfferType, OFFER_GOODS, OfferGood, OfferGoods,
  User, UserType, CityName
} from '../../types/index.js';

export class TSVOfferParser implements OfferParser {
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

  private parseCity(cityName: string): CityName {
    this.validateValueInObject(cityName, CityName);

    const name = cityName as CityName;

    return name;
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
    const offerGoods: OfferGoods = [];

    if (!goods) {
      return offerGoods;
    }

    goods.split(';').map(
      (good) => offerGoods.push(this.parseOfferGood(good))
    );

    return offerGoods;
  }

  public parse(line: string): Offer {
    const [
      title,
      description,
      publishDate,
      city,
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
      longitude,
    ] = line.split('\t');

    return {
      title,
      description,
      publishDate: this.parseDate(publishDate),
      cityName: this.parseCity(city),
      previewImage: previewImage,
      images: this.parseImages(images),
      isPremium: Boolean(isPremium),
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
}
